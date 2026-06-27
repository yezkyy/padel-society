import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { events } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import EventGrid from "@/components/events/EventGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const revalidate = 3600;

export default async function EventPage() {
  let eventList = [];
  try {
    eventList = await db.select().from(events);
  } catch (error) {
    console.error("Failed to query events, fallback to mocks:", error);
    eventList = [
      {
        id: "event-1",
        title: "Padel Society Open Tournament 2024",
        description: "Turnamen padel tahunan terbesar di Jakarta. Tunjukkan kemampuan terbaik tim Anda dan menangkan total hadiah Rp 25.000.000.",
        location: "Senayan Club Indoor",
        date: new Date("2024-11-15T09:00:00"),
        quota: 32,
        registrationFee: 250000,
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop",
        status: "UPCOMING",
      },
      {
        id: "event-2",
        title: "Weekend Social Coaching Clinic",
        description: "Pelatihan khusus bagi pemula yang dibimbing langsung oleh pelatih internasional berlisensi. Dapatkan tips dasar dan teknik memukul padel yang benar.",
        location: "Senayan Club Outdoor",
        date: new Date("2024-11-02T16:00:00"),
        quota: 16,
        registrationFee: 100000,
        imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop",
        status: "UPCOMING",
      },
    ];
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-16">
      {/* Header */}
      <ScrollReveal variant="fade">
        <section className="space-y-4">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
            Event & Turnamen
          </h1>
          <p className="font-sans text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Ikuti turnamen seru, gathering komunitas, dan klinik pelatihan eksklusif dari Padel Society.
          </p>
        </section>
      </ScrollReveal>

      {/* Events Grid */}
      <EventGrid eventList={eventList} />
    </div>
  );
}
