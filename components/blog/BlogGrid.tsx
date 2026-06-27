"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BlogGridProps {
  articles: any[];
}

export default function BlogGrid({ articles }: BlogGridProps) {
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
      {articles.map((art) => (
        <motion.div
          key={art.slug}
          variants={cardVariants}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 flex flex-col group will-change-transform"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={art.imageUrl}
              alt={art.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <div className="p-8 flex flex-col flex-1 space-y-4">
            <span className="text-[10px] text-[#506600] dark:text-[#ccff00] uppercase tracking-widest font-bold">
              {art.date}
            </span>
            <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight group-hover:text-black dark:group-hover:text-[#ccff00] transition-colors">
              {art.title}
            </h3>
            <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
              {art.excerpt}
            </p>
            <Button
              asChild
              variant="ghost"
              className="text-[#506600] dark:text-[#ccff00] hover:text-[#506600]/80 font-bold p-0 self-start text-xs h-auto items-center gap-1 mt-4 group/btn"
            >
              <Link href={`/blog/${art.slug}`} className="inline-flex items-center">
                Baca Selengkapnya 
                <span className="transition-transform duration-200 group-hover/btn:translate-x-1 ml-1 font-bold">→</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
