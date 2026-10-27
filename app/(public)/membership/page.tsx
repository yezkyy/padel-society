import Link from "next/link";
import { db } from "@/db";
import { membershipPlans } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldCheck } from "lucide-react";
import MembershipGrid from "@/components/membership/MembershipGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MOCK_MEMBERSHIP_PLANS, isDatabaseConfigured } from "@/lib/mock-data";

export const revalidate = 3600;

export default async function MembershipPage() {
  let plans: any[] = MOCK_MEMBERSHIP_PLANS;
  if (isDatabaseConfigured) {
    try {
      plans = await db.select().from(membershipPlans);
    } catch (error) {
      console.error("Failed to query plans, fallback to mocks:", error);
    }
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
