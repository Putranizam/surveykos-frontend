"use client";

export function Navbar({ onOpenBooking }) {
  return (
    <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <a href="#beranda" className="text-lg font-bold tracking-tight text-violet-700">
          SurveyKos.id
        </a>

        <nav className="hidden items-center gap-8 text-sm text-zinc-700 md:flex">
          <a href="#beranda" className="transition hover:text-violet-700">Beranda</a>
          <a href="#harga" className="transition hover:text-violet-700">Harga</a>
          <a href="#testimoni" className="transition hover:text-violet-700">Testimoni</a>
          <a href="#faq" className="transition hover:text-violet-700">FAQ</a>
        </nav>

        <button
          onClick={onOpenBooking}
          className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-800"
        >
          Pesan Survey
        </button>
      </div>
    </header>
  );
}
