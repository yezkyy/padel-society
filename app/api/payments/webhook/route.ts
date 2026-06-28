import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      payment_type,
      signature_key,
    } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return NextResponse.json({ error: "Server Key not configured" }, { status: 500 });
    }

    // 1. Verify signature
    // Signature formula: SHA512(order_id + status_code + gross_amount + server_key)
    const payload = order_id + status_code + gross_amount + serverKey;
    const calculatedSignature = createHash("sha512").update(payload).digest("hex");

    if (calculatedSignature !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Process status
    let paymentStatus = "UNPAID";
    let bookingStatus = "PENDING";
    const now = new Date();

    if (transaction_status === "settlement" || transaction_status === "capture") {
      paymentStatus = "PAID";
      bookingStatus = "CONFIRMED";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel"
    ) {
      paymentStatus = "FAILED";
      bookingStatus = "CANCELLED";
    } else if (transaction_status === "expire") {
      paymentStatus = "EXPIRED";
      bookingStatus = "EXPIRED";
    } else {
      // Keep current state for pending, etc.
      return NextResponse.json({ success: true, message: "No action needed for this status" });
    }

    // 3. Update database
    await db.transaction(async (tx) => {
      // Find payment record
      const paymentList = await tx.select().from(payments).where(eq(payments.bookingId, order_id));
      if (paymentList.length === 0) return;

      await tx
        .update(payments)
        .set({
          status: paymentStatus,
          paidAt: paymentStatus === "PAID" ? now : null,
          paymentMethod: payment_type || "MIDTRANS",
        })
        .where(eq(payments.bookingId, order_id));

      await tx
        .update(bookings)
        .set({
          status: bookingStatus,
          updatedAt: now,
        })
        .where(eq(bookings.id, order_id));
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Webhook processing failed:", e);
    return NextResponse.json({ error: e.message || "Failed to process webhook" }, { status: 500 });
  }
}
