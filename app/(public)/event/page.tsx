import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { events } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import EventGrid from "@/components/events/EventGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MOCK_EVENTS, isDatabaseConfigured } from "@/lib/mock-data";

export const revalidate = 3600;

export default async function EventPage() {
  let eventList: any[] = MOCK_EVENTS;
  if (isDatabaseConfigured) {
    try {
      eventList = await db.select().from(events);
    } catch (error) {
      console.error("Failed to query events, fallback to mocks:", error);
    }
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
