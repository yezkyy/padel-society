import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { courts } from "@/db/schema";
import { eq, and, like } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { CourtFilters } from "@/components/courts/CourtFilters";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

interface LapanganPageProps {
  searchParams: Promise<{
    location?: string;
    type?: string;
    date?: string;
  }>;
}

export default async function LapanganPage({ searchParams }: LapanganPageProps) {
  const resolvedParams = await searchParams;
  const { location, type, date } = resolvedParams;

  const conditions = [eq(courts.status, "ACTIVE")];

  if (type) {
    conditions.push(like(courts.name, `%${type}%`));
  }

  // If location is specified, we filter mock location text
  let queryLocation = "";
  if (location === "jakarta-selatan") {
    queryLocation = "Jakarta Selatan";
  } else if (location === "bali") {
    queryLocation = "Bali";
  }

  let courtList = [];
  try {
    courtList = await db
      .select()
      .from(courts)
      .where(and(...conditions));

    // Post-filter location mock text
    if (queryLocation) {
      courtList = courtList.filter(
        (c) =>
          c.description?.includes(queryLocation) ||
          c.name.includes(queryLocation) ||
          (queryLocation === "Jakarta Selatan" && c.id.includes("court-1")) ||
          (queryLocation === "Jakarta Selatan" && c.id.includes("court-2"))
      );
    }
  } catch (error) {
    console.error("Failed to query courts, fallback to mock data:", error);
    courtList = [
      {
        id: "court-1",
        name: "Court 1 (Indoor)",
        description: "Lapangan indoor premium dengan pencahayaan LED standar turnamen dan karpet profesional. Lokasi Jakarta Selatan.",
        pricePerHour: 200000,
        status: "ACTIVE",
      },
      {
        id: "court-2",
        name: "Court 2 (Indoor)",
        description: "Lapangan indoor premium dengan ventilasi optimal dan karpet profesional. Lokasi Jakarta Selatan.",
        pricePerHour: 200000,
        status: "ACTIVE",
      },
      {
        id: "court-3",
        name: "Court 3 (Outdoor)",
        description: "Lapangan outdoor dengan pemandangan terbuka, cocok untuk sore hari. Lokasi Bali.",
        pricePerHour: 150000,
        status: "ACTIVE",
      },
    ].filter(
      (c) =>
        (!type || c.name.toLowerCase().includes(type.toLowerCase())) &&
        (!queryLocation || c.description.includes(queryLocation))
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-12">
      {/* Header Section */}
      <section className="space-y-4">
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
          Temukan Lapangan Terbaik
        </h1>
        <p className="font-sans text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Pilih lokasi dan tipe lapangan yang sesuai dengan gaya permainanmu.
        </p>
      </section>

      {/* Filters Bar */}
      <CourtFilters
        initialLocation={location}
        initialType={type}
        initialDate={date}
      />

      {/* Court Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courtList.length > 0 ? (
          courtList.map((court) => (
            <article
              key={court.id}
              className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col group"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={
                    court.name.includes("Outdoor")
                      ? "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop"
                      : "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop"
                  }
                  alt={court.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-[#ccff00]/25 text-black dark:text-[#ccff00] px-3.5 py-1 rounded-full backdrop-blur-md font-sans text-xs font-bold border border-[#ccff00]/30">
                  Tersedia
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {court.name}
                  </h3>
                  <span className="font-heading text-base font-bold text-[#506600] dark:text-[#ccff00]">
                    Rp {(court.pricePerHour / 1000).toFixed(0)}k
                    <span className="text-xs text-zinc-400 font-sans font-normal">/jam</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>
                    {court.description?.includes("Bali")
                      ? "Canggu, Bali"
                      : "Senayan, Jakarta Selatan"}
                  </span>
                </div>

                <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
                  {court.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold border border-zinc-100 dark:border-zinc-800">
                    {court.name.includes("Indoor") ? "Indoor" : "Outdoor"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold border border-zinc-100 dark:border-zinc-800">
                    Karpet Premium
                  </span>
                  <span className="px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold border border-zinc-100 dark:border-zinc-800">
                    Shower Room
                  </span>
                </div>

                <Button
                  asChild
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full py-4.5 h-auto text-xs font-semibold mt-4 transition-colors"
                >
                  <Link href={`/booking?courtId=${court.id}`}>Lihat Detail / Book</Link>
                </Button>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-16 text-center space-y-4">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Tidak ada lapangan yang sesuai dengan kriteria filter Anda.
            </p>
            <Button
              asChild
              className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full"
            >
              <Link href="/lapangan">Reset Filter</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
