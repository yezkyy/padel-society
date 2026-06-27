"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-none last:pb-0"
          >
            <button
              onClick={() => toggle(faq.id)}
              className="flex justify-between items-center w-full text-left font-heading text-base font-semibold py-3 text-zinc-900 dark:text-zinc-50 hover:text-[#506600] dark:hover:text-[#ccff00] transition-colors"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#506600] dark:text-[#ccff00]" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="font-sans text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 pb-2 pt-1">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
