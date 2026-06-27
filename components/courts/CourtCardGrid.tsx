"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CourtCardGridProps {
  activeCourts: any[];
}

export default function CourtCardGrid({ activeCourts }: CourtCardGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
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
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {activeCourts.slice(0, 3).map((court: any) => (
        <motion.div
          key={court.id}
          variants={cardVariants}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col group will-change-transform"
        >
          <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop"
              alt={court.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 400px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-6 flex flex-col flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {court.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#ccff00]/20 text-[#5b7300]">
                Tersedia
              </span>
            </div>
            <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {court.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>Senayan, Jakarta Selatan</span>
            </div>
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center mt-auto">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">
                  Harga per jam
                </span>
                <span className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Rp {court.pricePerHour.toLocaleString("id-ID")}
                </span>
              </div>
              <Button
                asChild
                size="sm"
                className="bg-[#ccff00] hover:bg-[#b5e000] text-black font-semibold rounded-full px-4 text-xs h-9 transition-transform duration-200 hover:scale-105 active:scale-95 shadow-md shadow-[#ccff00]/5 hover:shadow-lg hover:shadow-[#ccff00]/15"
              >
                <Link href={`/booking?courtId=${court.id}`}>Book Now</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function CourtCardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm flex flex-col animate-pulse"
        >
          <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 w-full" />
          <div className="p-6 flex flex-col flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
            </div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center mt-auto">
              <div className="space-y-1 w-1/3">
                <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="h-9 bg-[#ccff00]/10 rounded-full w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
