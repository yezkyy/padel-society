"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface EventGridProps {
  eventList: any[];
}

export default function EventGrid({ eventList }: EventGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      {eventList.map((event) => (
        <motion.div
          key={event.id}
          variants={cardVariants}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col group will-change-transform"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={event.imageUrl || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop"}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 bg-zinc-900 text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {event.status}
            </div>
          </div>

          <div className="p-8 flex flex-col flex-1 space-y-4">
            <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              {event.title}
            </h3>
            <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
              {event.description}
            </p>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>
                  {new Date(event.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-400" />
                <span>Kuota: {event.quota} Tim/Peserta</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  Rp {event.registrationFee.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center mt-auto">
              <Button
                asChild
                className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full px-6 py-2.5 h-auto text-xs transition-transform duration-200 hover:scale-105 active:scale-95 shadow-md shadow-[#ccff00]/5 hover:shadow-lg hover:shadow-[#ccff00]/15"
              >
                <Link href="/register">Daftar Sekarang</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
