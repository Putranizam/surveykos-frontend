"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Kapan saya akan menerima laporan survey?",
    answer:
      "Laporan lengkap berupa foto, video, dan berkas PDF akan dikirimkan maksimal 24 jam setelah tim kami mengunjungi lokasi.",
  },
  {
    question: "Apakah harga sudah termasuk biaya transportasi?",
    answer:
      "Ya, semua harga paket yang tertera sudah bersih dan sudah termasuk biaya transportasi ke lokasi tujuan.",
  },
  {
    question: "Bagaimana jika kamar kos yang ingin disurvey ternyata sudah penuh?",
    answer:
      "Kami akan mengonfirmasi status ketersediaan ke pemilik kos terlebih dahulu sebelum tim meluncur ke lokasi agar kuota survey Anda tidak hangus.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="mx-auto w-full max-w-6xl px-4 py-18 md:px-6">
      <motion.div {...reveal} className="mb-10 text-center" transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-100">Pertanyaan yang Sering Diajukan</h2>
        <p className="mt-3 text-sm text-zinc-600 md:text-base dark:text-zinc-400">
          Informasi penting sebelum Anda memesan layanan survey.
        </p>
      </motion.div>

      <motion.div {...reveal} className="space-y-3" transition={{ duration: 0.4 }}>
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article key={item.question} className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-zinc-900 md:text-base dark:text-zinc-100">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0">
                  <p className="px-5 pb-5 text-sm leading-6 text-zinc-600 md:text-[15px] dark:text-zinc-400">{item.answer}</p>
                </div>
              </div>
            </article>
          );
        })}
      </motion.div>
    </section>
  );
}
