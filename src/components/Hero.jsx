"use client";

import { motion } from "framer-motion";
import { Clock3, MapPinned, ShieldCheck } from "lucide-react";

const STATS = ["200+ Mahasiswa Puas", "3 Area di Malang", "98% Tingkat Kepuasan"];

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function Hero({ onOpenBooking }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white dark:from-zinc-950 dark:via-black dark:to-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(124,58,237,0.16),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(250,204,21,0.15),transparent_30%)] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(124,58,237,0.16),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(250,204,21,0.08),transparent_30%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
        <motion.div {...reveal} transition={{ duration: 0.45 }} className="space-y-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-violet-400">
            JASA SURVEY KOS TERPERCAYA
          </p>

          <h1 className="text-3xl leading-tight font-bold tracking-tight text-zinc-900 md:text-5xl dark:text-zinc-100">
            Cari Kos di Malang Tanpa Datang Langsung, Tetap Yakin Ambil Keputusan.
          </h1>

          <p className="max-w-xl text-sm leading-7 text-zinc-600 md:text-base dark:text-zinc-400">
            SurveyKos.id membantu mahasiswa luar kota menilai kos secara jujur,
            transparan, dan detail sebelum booking.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              Pesan Survey Sekarang
            </button>
            <a
              href="#harga"
              className="rounded-full border border-violet-300 bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              Lihat Paket Harga
            </a>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            {STATS.map((stat) => (
              <p key={stat} className="text-sm font-semibold text-violet-700 dark:text-violet-400">
                {stat}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-4">
          <FeatureCard
            icon={<MapPinned className="h-5 w-5" />}
            title="Area Lengkap"
            description="Suhat, Sigura-gura, Soekarno Hatta, Lowokwaru, dan area kampus lainnya."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Survey Jujur & Transparan"
            description="Foto dan video HD raw/unedited agar kondisi kos terlihat apa adanya."
          />
          <FeatureCard
            icon={<Clock3 className="h-5 w-5" />}
            title="Laporan Cepat 24 Jam"
            description="Ringkasan hasil survey dikirim langsung ke WhatsApp Anda."
          />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <article className="relative rounded-2xl border border-violet-100 bg-white p-5 pl-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <span className="absolute top-5 left-4 h-2 w-2 rounded-full bg-violet-500" />
      <div className="mb-3 inline-flex rounded-lg bg-violet-100 p-2 text-violet-700 dark:bg-violet-900/50 dark:text-violet-400">{icon}</div>
      <h3 className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </article>
  );
}
