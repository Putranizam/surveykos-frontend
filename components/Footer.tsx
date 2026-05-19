import { Camera, Clock3, Mail, MapPin, Phone, Send } from "lucide-react";

type FooterProps = {
  onOpenBooking: () => void;
  whatsappLink: string;
};

export function Footer({ onOpenBooking, whatsappLink }: FooterProps) {
  return (
    <footer className="bg-zinc-950 text-zinc-200">
      <div className="border-b border-zinc-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-5 px-4 py-10 md:flex-row md:items-center md:px-6">
          <div>
            <h3 className="text-2xl font-bold">Siap Dapat Kos Impian di Malang?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Tim kami siap bantu survey dengan cepat dan transparan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Pesan Survey Sekarang
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
            >
              Chat WhatsApp Dulu
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <h4 className="text-lg font-semibold text-white">SurveyKos.id</h4>
          <p className="mt-3 max-w-xs text-sm text-zinc-400">
            Layanan survey kos profesional untuk mahasiswa luar kota yang ingin
            tinggal nyaman di Malang.
          </p>
          <div className="mt-4 flex gap-3 text-zinc-300">
            <Camera className="h-4 w-4" />
            <Send className="h-4 w-4" />
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M18.244 2H21l-6.553 7.49L22 22h-5.95l-4.66-6.098L6.06 22H3.303l7.01-8.01L2 2h6.102l4.213 5.554zM17.2 20h1.525L7.24 3.89H5.605z" />
            </svg>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Area Layanan</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>Suhat & Dinoyo</li>
            <li>Sigura-gura</li>
            <li>Soekarno Hatta</li>
            <li>Sekitar UB & UM</li>
            <li>Lowokwaru</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Hubungi Kami</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +62 812-3456-7890
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> hello@surveykos.id
            </li>
            <li className="flex items-center gap-2">
              <Camera className="h-4 w-4" /> @surveykos.id
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Malang, Jawa Timur
            </li>
            <li className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" /> 08.00 - 21.00 WIB
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
