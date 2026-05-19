"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";

const PACKAGES = [
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
    subtitle: "Pilihan ideal untuk analisis lebih detail",
    features: [
      "Survey 1 lokasi",
      "20+ Foto HD",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const whatsappLink = useMemo(() => {
    const message =
      "Halo SurveyKos.id, saya ingin konsultasi dulu tentang layanan survey kos di Malang.";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, []);

  const openBooking = (pkg) => {
    setSelectedPackage(pkg || null);
    setIsModalOpen(true);
  };

  return (
    <div id="beranda" className="bg-white text-zinc-900">
      <Navbar onOpenBooking={() => openBooking()} />

      <main>
        <Hero onOpenBooking={() => openBooking()} />
        <Pricing packages={PACKAGES} onSelectPackage={openBooking} />
        <Testimonials />
        <FAQ />
      </main>

      <Footer onOpenBooking={() => openBooking()} whatsappLink={whatsappLink} />

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed right-5 bottom-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-105 hover:bg-green-600 animate-pulse"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {isModalOpen ? (
        <BookingModal
          onClose={() => setIsModalOpen(false)}
          defaultPackage={selectedPackage}
        />
      ) : null}
    </div>
  );
}
