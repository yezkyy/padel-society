import { db } from "@/db";
import { courts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BookingWizard } from "@/features/booking/BookingWizard";

export const dynamic = "force-dynamic";

interface BookingPageProps {
  searchParams: Promise<{
    courtId?: string;
  }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const resolvedParams = await searchParams;
  const courtId = resolvedParams.courtId;

  let activeCourts = [];
  try {
    activeCourts = await db
      .select()
      .from(courts)
      .where(eq(courts.status, "ACTIVE"));
  } catch (error) {
    console.error("Failed to query active courts, using fallback mocks:", error);
    activeCourts = [
      {
        id: "court-1",
        name: "Court 1 (Indoor)",
        description: "Lapangan indoor premium dengan pencahayaan LED standar turnamen.",
        pricePerHour: 200000,
        status: "ACTIVE",
      },
      {
        id: "court-2",
        name: "Court 2 (Indoor)",
        description: "Lapangan indoor premium dengan ventilasi optimal.",
        pricePerHour: 200000,
        status: "ACTIVE",
      },
      {
        id: "court-3",
        name: "Court 3 (Outdoor)",
        description: "Lapangan outdoor dengan pemandangan terbuka, cocok untuk sore hari.",
        pricePerHour: 150000,
        status: "ACTIVE",
      },
    ];
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-12">
      {/* Header */}
      <div className="text-center md:text-left space-y-4">
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
          Booking Lapangan
        </h1>
        <p className="font-sans text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Pilih jadwal bermain Anda di lapangan premium kami.
        </p>
      </div>

      <BookingWizard courts={activeCourts as any} initialCourtId={courtId} />
    </div>
  );
}
