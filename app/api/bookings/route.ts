import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings, courts, payments, promoCodes, user, memberships, websiteSettings } from "@/db/schema";
import { eq, and, gte, lte, or, lt, gt } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const { courtId, startTimeStr, endTimeStr, promoCode } = body;

    if (!courtId || !startTimeStr || !endTimeStr) {
      return apiError("Missing required parameters", 400);
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return apiError("Invalid date/time format", 400);
    }

    // 1. Get Court
    const courtList = await db.select().from(courts).where(eq(courts.id, courtId));
    const court = courtList[0];
    if (!court || court.status !== "ACTIVE") {
      return apiError("Court not found or not active", 404);
    }

    // 2. Overlap validation (prevent double booking)
    const overlapping = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.courtId, courtId),
          or(eq(bookings.status, "CONFIRMED"), eq(bookings.status, "PENDING")),
          lt(bookings.startTime, endTime),
          gt(bookings.endTime, startTime)
        )
      );

    if (overlapping.length > 0) {
      return apiError("Slot waktu yang dipilih sudah terisi", 400);
    }

    // 3. Compute Price
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    if (durationHours <= 0) {
      return apiError("End time must be after start time", 400);
    }

    let basePrice = Math.round(court.pricePerHour * durationHours);
    let totalPrice = basePrice;

    // Apply Member Discount if user has active membership
    let isMember = false;
    try {
      const activeMemberships = await db
        .select()
        .from(memberships)
        .where(
          and(
            eq(memberships.userId, session.user.id),
            eq(memberships.status, "ACTIVE"),
            gt(memberships.endDate, new Date())
          )
        );
      isMember = activeMemberships.length > 0;
    } catch (e) {
      console.warn("Could not query user membership, using false:", e);
    }

    if (isMember) {
      let memberDiscountRate = 10;
      try {
        const settings = await db
          .select()
          .from(websiteSettings)
          .where(eq(websiteSettings.key, "memberDiscount"));
        if (settings[0]) {
          memberDiscountRate = parseInt(settings[0].value) || 10;
        }
      } catch (e) {
        console.warn("Could not query website setting memberDiscount:", e);
      }
      
      const memberDiscount = Math.round((totalPrice * memberDiscountRate) / 100);
      totalPrice = Math.max(0, totalPrice - memberDiscount);
    }

    let discount = 0;

    // Apply Promo Code if provided
    if (promoCode) {
      const codeList = await db
        .select()
        .from(promoCodes)
        .where(and(eq(promoCodes.code, promoCode), eq(promoCodes.isActive, true)));
      const promo = codeList[0];
      if (promo) {
        const now = new Date();
        if (now >= promo.validFrom && now <= promo.validUntil) {
          if (promo.discountType === "PERCENT") {
            discount = Math.round((totalPrice * promo.discountValue) / 100);
          } else {
            discount = promo.discountValue;
          }
          totalPrice = Math.max(0, totalPrice - discount);
        }
      }
    }

    // 4. Create Booking inside database transaction
    const bookingId = `bk-${Math.random().toString(36).substr(2, 9)}`;
    const paymentId = `pay-${Math.random().toString(36).substr(2, 9)}`;

    // Call Midtrans Sandbox Snap API
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    let snapToken: string | null = null;
    let snapRedirectUrl: string | null = null;

    if (serverKey) {
      try {
        const authHeader = `Basic ${Buffer.from(serverKey + ":").toString("base64")}`;
        const midtransResponse = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": authHeader,
          },
          body: JSON.stringify({
            transaction_details: {
              order_id: bookingId,
              gross_amount: totalPrice,
            },
            credit_card: {
              secure: true,
            },
            customer_details: {
              first_name: session.user.name,
              email: session.user.email,
            },
            expiry: {
              unit: "minutes",
              duration: 15,
            },
          }),
        });

        const midtransData = await midtransResponse.json();
        if (midtransData.token) {
          snapToken = midtransData.token;
          snapRedirectUrl = midtransData.redirect_url;
        } else {
          console.error("Midtrans transaction creation failed:", midtransData);
        }
      } catch (e) {
        console.error("Error creating Midtrans transaction:", e);
      }
    }

    await db.transaction(async (tx) => {
      await tx.insert(bookings).values({
        id: bookingId,
        userId: session.user.id,
        courtId,
        startTime,
        endTime,
        status: "PENDING",
        totalPrice,
        promoCode: promoCode || null,
      });

      // Insert payment record with 15 mins expiry
      const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      await tx.insert(payments).values({
        id: paymentId,
        bookingId,
        amount: totalPrice,
        status: "UNPAID",
        expiryTime,
        externalId: snapToken,
        paymentMethod: snapToken ? "MIDTRANS" : null,
      });
    });

    return apiSuccess("Booking berhasil dibuat", {
      bookingId,
      totalPrice,
      expiryMinutes: 15,
      snapToken,
      snapRedirectUrl,
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to create booking", 500);
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return apiError("Unauthorized", 401);
  }

  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return apiError("Missing bookingId", 400);
  }

  try {
    const bookingList = await db
      .select({
        id: bookings.id,
        status: bookings.status,
        totalPrice: bookings.totalPrice,
      })
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.userId, session.user.id)));

    const bookingObj = bookingList[0];
    if (!bookingObj) {
      return apiError("Booking tidak ditemukan", 404);
    }

    return apiSuccess("Status booking ditemukan", bookingObj);
  } catch (error: any) {
    return apiError(error.message || "Gagal mengambil status booking", 500);
  }
}
