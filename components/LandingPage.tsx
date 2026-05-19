"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import { MessageCircle } from "lucide-react";

export type PackageOption = {
  id: "visit" | "reguler" | "unlimited";
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  popular?: boolean;
};

const packages: PackageOption[] = [
  {
    id: "visit",
    name: "Paket Visit",
    price: "Rp 20.000",
    subtitle: "Survey cepat untuk 1 lokasi kos",
    features: [
      "Survey 1 lokasi",
      "10+ foto",
      "Laporan via WhatsApp",
      "Cek fasilitas dasar",
    ],
  },
  {
    id: "reguler",
    name: "Paket Reguler",
    price: "Rp 50.000",
    subtitle: "Pilihan ideal untuk analisa lebih detail",
    features: [
      "Survey 1 lokasi",
      "20+ foto HD",
      "Video walkthrough",
      "Laporan PDF terstruktur",
      "Cek kebersihan",
      "Negosiasi harga awal",
    ],
  },
  {
    id: "unlimited",
    name: "Paket Unlimited",
    price: "Rp 100.000",
    subtitle: "Pendampingan penuh untuk keputusan terbaik",
    popular: true,
    features: [
      "Survey hingga 3 lokasi",
      "Foto & video semua lokasi",
      "Laporan komparasi menyeluruh",
      "Cek semua fasilitas & akses",
      "Negosiasi harga penuh",
      "Konsultasi & rekomendasi",
      "Jadwal prioritas",
    ],
  },
];

const WHATSAPP_NUMBER = "6281217052097";

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(
    null,
  );

  const whatsappLink = useMemo(() => {
    const msg =
      "Halo SurveyKos.id, saya ingin tanya dulu tentang layanan survey kos di Malang.";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, []);

  const openModal = (pkg?: PackageOption) => {
    setSelectedPackage(pkg ?? null);
    setIsOpen(true);
  };

  return (
    <div className="bg-white text-zinc-900">
      <Header onOpenBooking={() => openModal()} />
      <main>
        <Hero onOpenBooking={() => openModal()} />
        <Pricing packages={packages} onSelectPackage={openModal} />
        <Testimonials />
      </main>
      <Footer onOpenBooking={() => openModal()} whatsappLink={whatsappLink} />

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="fixed right-5 bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105 hover:bg-green-600"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {isOpen ? (
        <BookingModal
          onClose={() => setIsOpen(false)}
          defaultPackage={selectedPackage}
        />
      ) : null}
    </div>
  );
}
