import Image from "next/image";

export default function GaleriPage() {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400&auto=format&fit=crop",
      caption: "Pertandingan Final Open Tournament 2024",
    },
    {
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop",
      caption: "Coaching Clinic Bersama Coach Internasional",
    },
    {
      url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&auto=format&fit=crop",
      caption: "Fasilitas Indoor Court Premium",
    },
    {
      url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=400&auto=format&fit=crop",
      caption: "Gathering Komunitas Weekend Padel",
    },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-16">
      <section className="space-y-4">
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-none">
          Galeri Foto & Video
        </h1>
        <p className="font-sans text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Dokumentasi keseruan turnamen, aktivitas komunitas, dan keindahan fasilitas kami.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {images.map((img, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm group hover:shadow-xl transition-shadow flex flex-col"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={img.url}
                alt={img.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-center mt-auto">
              <p className="font-sans text-xs text-zinc-600 dark:text-zinc-400 font-semibold line-clamp-2">
                {img.caption}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
