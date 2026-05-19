"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function Pricing({ packages, onSelectPackage }) {
  return (
    <section id="harga" className="mx-auto w-full max-w-6xl px-4 py-18 md:px-6">
      <motion.div {...reveal} className="mb-10 text-center" transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-100">Harga Jelas, Hasil Terpercaya</h2>
        <p className="mt-3 text-sm text-zinc-600 md:text-base dark:text-zinc-400">
          Pilih paket survey sesuai kebutuhan dan budget kamu.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg, index) => (
          <motion.article
            key={pkg.id}
            {...reveal}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={`relative rounded-3xl border bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-lg dark:bg-zinc-900 ${
              pkg.popular ? "border-violet-300 ring-2 ring-violet-100 dark:border-violet-600 dark:ring-violet-900/50" : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            {pkg.popular ? (
              <span className="absolute -top-3 right-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-zinc-900">
                Terpopuler
              </span>
            ) : null}

            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{pkg.name}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{pkg.subtitle}</p>
            <p className="mt-4 text-3xl font-bold text-violet-700 dark:text-violet-400">{pkg.price}</p>

            <ul className="mt-5 space-y-2">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPackage(pkg)}
              className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                pkg.popular
                  ? "bg-violet-700 text-white hover:bg-violet-800 dark:bg-violet-600 dark:hover:bg-violet-500"
                  : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              Pilih Paket Ini
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
