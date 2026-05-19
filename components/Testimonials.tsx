"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Bener-bener ngebantu. Saya di luar kota, tapi bisa lihat kondisi kos dengan jujur sebelum bayar DP.",
    name: "Alya, Mahasiswa UB",
    location: "Sigura-gura, Malang",
  },
  {
    quote:
      "Laporannya rapi, videonya jelas, dan timnya komunikatif. Hemat waktu banget.",
    name: "Rizky, Mahasiswa UM",
    location: "Suhat, Malang",
  },
  {
    quote:
      "Paket unlimited paling worth it karena bisa bandingin beberapa kos sekaligus.",
    name: "Nabila, Mahasiswa Polinema",
    location: "Lowokwaru, Malang",
  },
];

const stats = [
  "500+ Survey di Malang",
  "4.9? Rating Rata-rata",
  "98% Klien Puas",
  "10+ Area di Malang",
];

export function Testimonials() {
  return (
    <section id="testimoni" className="bg-zinc-50 py-18">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
            Cerita Nyata dari Mahasiswa
          </h2>
          <p className="mt-3 text-sm text-zinc-600 md:text-base">
            Pengalaman mereka jadi bukti kualitas layanan kami.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm leading-6 text-zinc-700">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-zinc-900">{item.name}</p>
              <p className="text-xs text-zinc-500">{item.location}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat}
              className="rounded-xl border border-violet-100 bg-white p-4 text-center text-sm font-semibold text-violet-700"
            >
              {stat}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
