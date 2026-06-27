import Link from "next/link";
import { db } from "@/db";
import { membershipPlans } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldCheck } from "lucide-react";
import MembershipGrid from "@/components/membership/MembershipGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const revalidate = 3600;

export default async function MembershipPage() {
  let plans = [];
  try {
    plans = await db.select().from(membershipPlans);
  } catch (error) {
    console.error("Failed to query plans, fallback to mocks:", error);
    plans = [
      {
        id: "plan-starter",
        name: "Starter Pack",
        description: "Cocok untuk pemula yang ingin mencoba padel secara santai.",
        price: 150000,
        durationDays: 30,
        benefits: ["Diskon booking 10%", "Prioritas booking slot H-3"],
      },
      {
        id: "plan-elite",
        name: "Elite Pro",
        description: "Untuk pemain setia dengan prioritas dan diskon maksimal.",
        price: 500000,
        durationDays: 30,
        benefits: [
          "Diskon booking 20%",
          "Prioritas booking slot H-7",
          "Akses ke event eksklusif",
          "Gratis sewa raket 2x/bulan",
        ],
      },
    ];
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-24">
      {/* Header */}
      <ScrollReveal variant="fade">
        <section className="text-center space-y-6 max-w-3xl mx-auto py-12">
          <span className="text-xs uppercase tracking-widest font-bold text-[#506600] dark:text-[#ccff00]">
            Membership Program
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight">
            Maksimalkan Pengalaman Padel Anda
          </h1>
          <p className="font-sans text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Pilih paket keanggotaan Padel Society dan nikmati potongan harga khusus, prioritas pemilihan jadwal lapangan, dan akses ke acara eksklusif.
          </p>
        </section>
      </ScrollReveal>

      {/* Pricing Cards */}
      <MembershipGrid plans={plans} />
    </div>
  );
}
