import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { courts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero/HeroSection";
import AboutSection from "@/components/about/AboutSection";
import FacilitiesSection from "@/components/facilities/FacilitiesSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import CourtCardGrid from "@/components/courts/CourtCardGrid";
import {
  Trophy,
  Users,
  Calendar,
  Star,
  MapPin,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";

import { MOCK_COURTS, isDatabaseConfigured } from "@/lib/mock-data";

export const revalidate = 3600; // Cache for 1 hour

export default async function LandingPage() {
  // Fetch active courts dynamically from database if configured, or use mock data
  let activeCourts: any[] = MOCK_COURTS.filter((c) => c.status === "ACTIVE");
  if (isDatabaseConfigured) {
    try {
      activeCourts = await db
        .select()
        .from(courts)
        .where(eq(courts.status, "ACTIVE"));
    } catch (error) {
      console.error("Failed to fetch courts, fallback to static mock:", error);
    }
  }

  const whyUs = [
    {
      title: "Booking Real-Time",
      description: "Sistem reservasi instan 24/7 tanpa perlu konfirmasi manual via WhatsApp.",
      icon: Sparkles,
    },
    {
      title: "Fasilitas Premium",
      description: "Karpet standar turnamen, pencahayaan LED profesional, dan ruang ganti mewah.",
      icon: Trophy,
    },
    {
      title: "Komunitas Elit",
      description: "Gabung dengan komunitas padel eksklusif dan ikut serta dalam turnamen reguler.",
      icon: Users,
    },
    {
      title: "Harga Transparan",
      description: "Tanpa biaya tersembunyi. Diskon khusus menanti untuk member aktif.",
      icon: Shield,
    },
  ];


  const steps = [
    {
      step: "01",
      title: "Pilih Jadwal",
      description: "Pilih lapangan indoor/outdoor dan jam bermain yang Anda inginkan secara real-time.",
    },
    {
      step: "02",
      title: "Bayar Online",
      description: "Selesaikan transaksi secara instan menggunakan QRIS, Virtual Account, atau E-Wallet.",
    },
    {
      step: "03",
      title: "Main Padel",
      description: "Tunjukkan invoice/QR Code di lokasi, masuk ke lapangan, dan nikmati permainan Anda.",
    },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* 1. Refactored Hero Section */}
      <HeroSection />

      {/* 3. About Us (Redesigned Client Component) */}
      <AboutSection />

      {/* 4. Why Choose Us */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#506600] dark:text-[#ccff00]">
              Keunggulan Kami
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Mengapa Memilih Padel Society?
            </h2>
            <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Kami mengintegrasikan teknologi modern dengan layanan fisik premium untuk memberikan pengalaman olahraga terbaik untuk Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 space-y-4 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* 5. Courts Section */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs uppercase tracking-widest font-bold text-[#506600] dark:text-[#ccff00]">
                Pilihan Lapangan
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                Pilih Lapangan Bermain Anda
              </h2>
            </div>
            <Button
              asChild
              variant="ghost"
              className="text-[#506600] dark:text-[#ccff00] hover:text-[#506600]/80 font-bold items-center gap-2 p-0 h-auto self-start"
            >
              <Link href="/lapangan">
                Lihat Semua Lapangan <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <CourtCardGrid activeCourts={activeCourts} />
        </section>
      </ScrollReveal>

      {/* 6. Facilities & Amenities (Redesigned Client Component) */}
      <FacilitiesSection />

      {/* 7. How it Works */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#506600] dark:text-[#ccff00]">
              Cara Reservasi
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Bagaimana Cara Melakukan Booking?
            </h2>
            <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
              Sistem pemesanan kami dirancang sesederhana mungkin untuk kenyamanan Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 border-t border-dashed border-zinc-200 dark:border-zinc-800 hidden md:block -z-10"></div>
            {steps.map((item, index) => (
              <div key={index} className="text-center space-y-4 bg-white dark:bg-zinc-950 p-6 rounded-3xl relative">
                <div className="w-12 h-12 rounded-full bg-[#ccff00] text-black font-heading text-lg font-bold flex items-center justify-center mx-auto shadow-lg shadow-[#ccff00]/25">
                  {item.step}
                </div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 8. Call to Action Akhir */}
      <ScrollReveal>
        <section className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="bg-[#ccff00] dark:bg-[#b5e000] rounded-[2.5rem] p-12 md:p-16 text-center text-black space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-4 max-w-2xl mx-auto z-10 relative">
              <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Siap untuk Bermain Hari Ini?
              </h2>
              <p className="font-sans text-base text-zinc-900 leading-relaxed font-medium">
                Gabung sekarang dengan ribuan pecinta padel lainnya. Dapatkan prioritas booking dan potongan harga khusus bagi Anda yang mendaftar membership.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center z-10 relative pt-4">
              <Button
                asChild
                className="bg-black hover:bg-zinc-800 text-white font-semibold rounded-full px-8 py-4 h-auto text-sm transition-transform hover:-translate-y-0.5"
              >
                <Link href="/booking">Booking Sekarang</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-black text-black hover:bg-black/5 font-semibold rounded-full px-8 py-4 h-auto text-sm bg-transparent"
              >
                <Link href="/membership">Gabung Member</Link>
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
