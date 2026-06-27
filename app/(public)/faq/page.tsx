import { db } from "@/db";
import { faqs } from "@/db/schema";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

export const revalidate = 3600;

export default async function FaqPage() {
  let faqList = [];
  try {
    faqList = await db.select().from(faqs);
  } catch (error) {
    console.error("Failed to query FAQs, fallback to mocks:", error);
    faqList = [
      {
        id: "faq-1",
        question: "Bagaimana cara melakukan booking lapangan?",
        answer: "Pilih lapangan dan jadwal yang tersedia di halaman 'Lapangan', klik 'Book Now' lalu ikuti alur pembayaran hingga selesai. Slot Anda akan terkunci selama 15 menit selama proses checkout.",
        category: "Booking",
      },
      {
        id: "faq-2",
        question: "Apakah tersedia penyewaan raket?",
        answer: "Ya! Kami menyewakan raket padel premium seharga Rp 35.000 per sesi. Bola baru juga dapat dibeli di Pro Shop kami.",
        category: "Fasilitas",
      },
      {
        id: "faq-3",
        question: "Bagaimana kebijakan pembatalan dan reschedule?",
        answer: "Pembatalan dapat dilakukan hingga H-6 jam sebelum sesi dimulai dengan potongan biaya admin 10%. Reschedule diperbolehkan maksimal 1 kali hingga H-4 jam jika slot pengganti tersedia.",
        category: "Kebijakan",
      },
    ];
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <section className="text-center space-y-4 py-12">
        <span className="text-xs uppercase tracking-widest font-bold text-[#506600] dark:text-[#ccff00]">
          Pertanyaan Umum
        </span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
          Ada Pertanyaan?
        </h1>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
          Temukan jawaban atas pertanyaan yang paling sering ditanyakan oleh member kami.
        </p>
      </section>

      {/* Accordion Component */}
      <section className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
        <FaqAccordion faqs={faqList} />
      </section>
    </div>
  );
}
