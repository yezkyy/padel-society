import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BlogGrid from "@/components/blog/BlogGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const revalidate = 3600;

export default function BlogPage() {
  const articles = [
    {
      slug: "tips-bermain-padel-untuk-pemula",
      title: "5 Tips Bermain Padel untuk Pemula agar Cepat Mahir",
      excerpt: "Olahraga padel sedang naik daun! Temukan teknik memegang raket, posisi berdiri, dan strategi memukul bola agar Anda siap bermain di lapangan.",
      imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop",
      date: "24 Okt 2024",
    },
    {
      slug: "panduan-memilih-raket-padel",
      title: "Panduan Lengkap Memilih Raket Padel yang Sesuai",
      excerpt: "Bentuk diamond, teardrop, atau round? Baca panduan ini untuk menemukan raket padel yang paling sesuai dengan gaya bermain Anda.",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop",
      date: "18 Okt 2024",
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-16">
      <ScrollReveal variant="fade">
        <section className="space-y-4">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
            Blog & Artikel
          </h1>
          <p className="font-sans text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Temukan tips taktis, panduan pemilihan gear, dan kabar terbaru dari dunia padel di Indonesia.
          </p>
        </section>
      </ScrollReveal>

      <BlogGrid articles={articles} />
    </div>
  );
}
