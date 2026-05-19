"use client";

import { motion } from "framer-motion";
import { Clock3, MapPinned, ShieldCheck } from "lucide-react";

type HeroProps = {
  onOpenBooking: () => void;
};

const badges = [
  "200+ Mahasiswa Puas",
  "3 Area di Malang",
  "98% Tingkat Kepuasan",
];

export function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-white to-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(124,58,237,0.16),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(250,204,21,0.20),transparent_30%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <p className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold tracking-wide text-violet-700 uppercase">
            Jasa Survey Kos Terpercaya
          </p>
          <h1 className="text-3xl leading-tight font-bold tracking-tight text-zinc-900 md:text-5xl">
            Cari Kos di Malang Tanpa Datang Langsung, Tetap Yakin Ambil Keputusan.
          </h1>
          <p className="max-w-xl text-sm leading-7 text-zinc-600 md:text-base">
            SurveyKos.id membantu mahasiswa luar kota menilai kos secara jujur,
            transparan, dan detail sebelum booking.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-800"
            >
              Pesan Survey Sekarang
            </button>
            <a
              href="#harga"
              className="rounded-full border border-violet-300 px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
            >
              Lihat Paket Harga
            </a>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-medium text-violet-700"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid gap-4"
        >
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

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 inline-flex rounded-lg bg-violet-100 p-2 text-violet-700">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-semibold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-600">{description}</p>
    </div>
  );
}
