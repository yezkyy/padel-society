import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { courts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { MapPin, Trophy, Users, Shield, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface DetailCourtPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailCourtPage({ params }: DetailCourtPageProps) {
  const { id } = await params;

  let court = null;
  try {
    const list = await db.select().from(courts).where(eq(courts.id, id));
    court = list[0] || null;
  } catch (error) {
    console.error("Database query failed, trying mock fallback:", error);
  }

  // Fallback mocks
  if (!court) {
    const fallbackMocks: Record<string, any> = {
      "court-1": {
        id: "court-1",
        name: "Court 1 (Indoor)",
        description:
          "Lapangan indoor premium dengan pencahayaan LED standar turnamen dan karpet profesional. Memberikan kenyamanan bermain maksimal tanpa terganggu cuaca luar ruangan. Dilengkapi AC sentral dan area duduk eksklusif.",
        pricePerHour: 200000,
      },
      "court-2": {
        id: "court-2",
        name: "Court 2 (Indoor)",
        description:
          "Lapangan indoor premium dengan ventilasi optimal dan karpet profesional. Didesain dengan langit-langit yang tinggi memberikan fleksibilitas penuh untuk pukulan lob Anda.",
        pricePerHour: 200000,
      },
      "court-3": {
        id: "court-3",
        name: "Court 3 (Outdoor)",
        description:
          "Lapangan outdoor premium di kelilingi lanskap hijau yang menyegarkan. Sempurna untuk bermain di sore dan malam hari dengan sistem lampu sorot LED tanpa silau.",
        pricePerHour: 150000,
      },
    };
    court = fallbackMocks[id];
  }

  if (!court) {
    notFound();
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-12">
      <Link
        href="/lapangan"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Lapangan
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-lg border border-black/5 dark:border-white/5">
            <Image
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop"
              alt={court.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              {court.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <MapPin className="w-4 h-4" />
              <span>Senayan, Jakarta Selatan</span>
            </div>
            <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pt-2">
              {court.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2rem] p-8 shadow-xl space-y-6 sticky top-28">
            <div className="space-y-2">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
                Harga Sewa
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-bold text-zinc-950 dark:text-zinc-50">
                  Rp {court.pricePerHour.toLocaleString("id-ID")}
                </span>
                <span className="text-zinc-400 dark:text-zinc-500 text-sm">/ jam</span>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6 space-y-4">
              <h3 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                Fasilitas Lapangan
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <Trophy className="w-4 h-4 text-zinc-400" />
                  <span>Karpet Premium</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <Users className="w-4 h-4 text-zinc-400" />
                  <span>Kapasitas 4 Pemain</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <Shield className="w-4 h-4 text-zinc-400" />
                  <span>Shower Room</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>Loker Penyimpanan</span>
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-xl py-4 h-auto text-sm shadow-lg shadow-[#ccff00]/10 transition-transform hover:-translate-y-0.5"
            >
              <Link href={`/booking?courtId=${court.id}`}>Booking Lapangan Ini</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
