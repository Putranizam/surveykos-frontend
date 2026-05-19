"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function Pricing({ packages, onSelectPackage }) {
  return (
    <section id="harga" className="mx-auto w-full max-w-6xl px-4 py-18 md:px-6">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-4xl">Harga Jelas, Hasil Terpercaya</h2>
        <p className="mt-3 text-sm text-zinc-600 md:text-base">
          Pilih paket survey sesuai kebutuhan dan budget kamu.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((pkg, index) => (
          <motion.article
            key={pkg.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={`relative rounded-3xl border bg-white p-6 shadow-sm transition hover:scale-[1.02] hover:shadow-lg ${
              pkg.popular ? "border-violet-300 ring-2 ring-violet-100" : "border-zinc-200"
            }`}
          >
            {pkg.popular ? (
              <span className="absolute -top-3 right-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-zinc-900">
                Terpopuler
              </span>
            ) : null}

            <h3 className="text-xl font-semibold text-zinc-900">{pkg.name}</h3>
            <p className="mt-1 text-sm text-zinc-500">{pkg.subtitle}</p>
            <p className="mt-4 text-3xl font-bold text-violet-700">{pkg.price}</p>

            <ul className="mt-5 space-y-2">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-zinc-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPackage(pkg)}
              className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                pkg.popular
                  ? "bg-violet-700 text-white hover:bg-violet-800"
                  : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
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
