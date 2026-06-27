import Image from "next/image";
import { Trophy, Shield, Users, Heart } from "lucide-react";

export default function TentangKamiPage() {
  const values = [
    {
      title: "Integritas & Kualitas",
      description: "Kami hanya menyediakan lapangan dan peralatan dengan standar sertifikasi tertinggi.",
      icon: Shield,
    },
    {
      title: "Komunitas Inklusif",
      description: "Kami percaya olahraga adalah untuk semua orang. Kami menyambut pemain dari segala tingkat kemampuan.",
      icon: Users,
    },
    {
      title: "Semangat Olahraga",
      description: "Kami merayakan setiap poin, pertandingan, dan turnamen dengan antusiasme yang tinggi.",
      icon: Trophy,
    },
    {
      title: "Layanan Pelanggan Utama",
      description: "Dari booking hingga bermain, kenyamanan Anda adalah prioritas nomor satu kami.",
      icon: Heart,
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto py-12">
        <span className="text-xs uppercase tracking-widest font-bold text-[#506600] dark:text-[#ccff00]">
          Cerita Kami
        </span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight">
          Menghubungkan Komunitas Padel Indonesia
        </h1>
        <p className="font-sans text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Padel Society didirikan pada tahun 2024 dengan satu misi utama: menciptakan wadah olahraga padel premium yang menyatukan kenyamanan digital dengan pengalaman fisik kelas dunia.
        </p>
      </section>

      {/* Story Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Bagaimana Semuanya Dimulai
          </h2>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Berawal dari beberapa lapangan sederhana di Jakarta, kami melihat antusiasme yang luar biasa dari masyarakat Indonesia terhadap olahraga Padel. Proses booking manual sering kali menyebabkan slow response dan double-booking yang membuat frustrasi pemain.
          </p>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Padel Society hadir untuk menyederhanakan proses ini. Kami mengintegrasikan sistem booking real-time terotomatisasi dengan fasilitas club yang premium untuk memastikan waktu bermain Anda dihargai sepenuhnya.
          </p>
        </div>
        <div className="relative aspect-video md:aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5 shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop"
            alt="Visi Padel Society"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Corporate Values */}
      <section className="space-y-16">
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-[#506600] dark:text-[#ccff00]">
            Nilai Perusahaan
          </span>
          <h2 className="font-heading text-3xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Prinsip yang Membimbing Kami
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, index) => {
            const Icon = val.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300 space-y-4 flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center text-[#506600] dark:text-[#ccff00]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {val.title}
                </h3>
                <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
