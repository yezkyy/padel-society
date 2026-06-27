import { NextRequest } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq, and, gte, lte, or } from "drizzle-orm";
import { apiSuccess, apiError } from "@/lib/api-response";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: Context) {
  const { id: courtId } = await context.params;
  const searchParams = request.nextUrl.searchParams;
  const dateStr = searchParams.get("date"); // YYYY-MM-DD

  if (!dateStr) {
    return apiError("Parameter 'date' diperlukan", 400);
  }

  try {
    const startOfDay = new Date(`${dateStr}T00:00:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59`);

    // Get active bookings
    const list = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.courtId, courtId),
          gte(bookings.startTime, startOfDay),
          lte(bookings.endTime, endOfDay),
          or(eq(bookings.status, "CONFIRMED"), eq(bookings.status, "PENDING"))
        )
      );

    const bookedSlots = list.map((b) => ({
      id: b.id,
      start: b.startTime.toISOString(),
      end: b.endTime.toISOString(),
    }));

    return apiSuccess("Berhasil mengambil ketersediaan slot", bookedSlots);
  } catch (error: any) {
    return apiError(error.message || "Gagal mengambil data ketersediaan", 500);
  }
}
