import { db } from "@/db";
import { faqs } from "@/db/schema";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { MOCK_FAQS, isDatabaseConfigured } from "@/lib/mock-data";

export const revalidate = 3600;

export default async function FaqPage() {
  let faqList: any[] = MOCK_FAQS;
  if (isDatabaseConfigured) {
    try {
      faqList = await db.select().from(faqs);
    } catch (error) {
      console.error("Failed to query FAQs, fallback to mocks:", error);
    }
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
