import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  const mockArticles: Record<string, any> = {
    "tips-bermain-padel-untuk-pemula": {
      title: "5 Tips Bermain Padel untuk Pemula agar Cepat Mahir",
      date: "24 Okt 2024",
      imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop",
      content:
        "Olahraga padel sedang naik daun di Indonesia! Bagi Anda yang baru memulai, berikut adalah 5 tips mendasar agar Anda cepat beradaptasi di lapangan: \n\n1. Pelajari Grip Continental: Pegangan raket yang benar sangat krusial. Gunakan grip seperti memegang palu.\n2. Manfaatkan Dinding Kaca: Jangan panik saat bola melewati Anda. Padel menggunakan dinding kaca untuk pantulan, gunakan ini sebagai keuntungan taktis.\n3. Tekuk Lutut Anda: Sentuhan bola padel relatif rendah dibandingkan tenis, menjaga tubuh tetap rendah akan meningkatkan akurasi pukulan.\n4. Bermain Secara Tim: Koordinasi dengan rekan duet Anda di lapangan sangat penting untuk menutup area yang kosong.\n5. Konsistensi Over Power: Fokuslah pada penempatan bola yang konsisten daripada memukul sekeras mungkin.",
    },
    "panduan-memilih-raket-padel": {
      title: "Panduan Lengkap Memilih Raket Padel yang Sesuai",
      date: "18 Okt 2024",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
      content:
        "Memilih raket padel yang tepat sangat menentukan tingkat kenyamanan dan kualitas pukulan Anda. Berikut klasifikasi bentuk raket padel:\n\n- Round (Bulat): Menawarkan kontrol maksimal dan sweet spot yang besar di tengah. Pilihan terbaik untuk pemula.\n- Teardrop (Tetes Air): Keseimbangan sempurna antara kontrol dan kekuatan. Cocok untuk pemain tingkat menengah.\n- Diamond (Belah Ketupat): Berat terpusat di bagian atas raket, menghasilkan kekuatan pukulan maksimal. Direkomendasikan hanya untuk pemain berpengalaman.",
    },
  };

  const article = mockArticles[slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Blog
      </Link>

      <div className="space-y-6">
        <span className="text-xs uppercase tracking-widest font-bold text-[#506600] dark:text-[#ccff00]">
          {article.date}
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-lg border border-black/5 dark:border-white/5">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="font-sans text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-6 whitespace-pre-line pt-6">
          {article.content}
        </div>
      </div>
    </div>
  );
}
