"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MembershipGridProps {
  plans: any[];
}

export default function MembershipGrid({ plans }: MembershipGridProps) {
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
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto"
    >
      {plans.map((plan) => {
        const isElite = plan.name.toLowerCase().includes("elite");
        return (
          <motion.div
            key={plan.id}
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={`border rounded-[2.5rem] p-10 flex flex-col space-y-8 relative overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 will-change-transform ${
              isElite
                ? "bg-zinc-900 border-zinc-800 text-white dark:bg-zinc-900/50"
                : "bg-white border-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:border-zinc-800"
            }`}
          >
            {isElite && (
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-5 right-5 bg-[#ccff00] text-black font-semibold text-[10px] uppercase tracking-wider py-1 px-3 rounded-full shadow-[0_0_15px_rgba(204,255,0,0.4)]"
              >
                Populer
              </motion.div>
            )}

            <div className="space-y-4">
              <span
                className={`text-xs uppercase tracking-widest font-bold ${
                  isElite ? "text-[#ccff00]" : "text-[#506600] dark:text-[#ccff00]"
                }`}
              >
                {plan.name}
              </span>
              <h3 className="font-heading text-2xl font-bold">{plan.name}</h3>
              <p className="font-sans text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-heading text-5xl font-bold">
                Rp {plan.price.toLocaleString("id-ID")}
              </span>
              <span className="text-zinc-400 dark:text-zinc-500 text-sm">
                / {plan.durationDays} hari
              </span>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-8 space-y-4 flex-1">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider">
                Benefit Keanggotaan
              </h4>
              <ul className="space-y-3">
                {(plan.benefits as string[]).map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        isElite ? "text-[#ccff00]" : "text-[#506600] dark:text-[#ccff00]"
                      }`}
                    />
                    <span className={isElite ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              asChild
              className={`w-full font-semibold rounded-xl py-4 h-auto text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isElite
                  ? "bg-[#ccff00] hover:bg-[#b5e000] text-black shadow-md shadow-[#ccff00]/10 hover:shadow-lg hover:shadow-[#ccff00]/25"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-[#ccff00] dark:hover:bg-[#b5e000] dark:text-black"
              }`}
            >
              <Link href="/register">Gabung Member</Link>
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
