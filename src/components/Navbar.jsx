"use client";

import { useState, useEffect } from "react";
import { Search, Menu, X, Sun, Moon } from "lucide-react";

export function Navbar({ onOpenBooking, isDarkMode, toggleDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>


      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-black/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          
          {/* Logo Section */}
          <a href="#beranda" onClick={closeMenu} className="group inline-flex items-center gap-2">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition-transform duration-300 group-hover:scale-110 dark:bg-violet-900/50 dark:text-violet-400">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5.5 9.5V20h13V9.5" />
                <path d="M10 20v-5h4v5" />
              </svg>
              <Search className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full bg-white p-0.5 text-violet-700 dark:bg-black dark:text-violet-400" />
            </span>
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              SurveyKos.id
            </span>
          </a>

          {/* Desktop Navigation Link (Hidden on Mobile) */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-700 md:flex dark:text-zinc-300">
            <a href="#beranda" className="transition hover:text-violet-700 dark:hover:text-violet-400">Beranda</a>
            <a href="#harga" className="transition hover:text-violet-700 dark:hover:text-violet-400">Harga</a>
            <a href="#testimoni" className="transition hover:text-violet-700 dark:hover:text-violet-400">Testimoni</a>
            <a href="#faq" className="transition hover:text-violet-700 dark:hover:text-violet-400">FAQ</a>
          </nav>

          {/* CTA & Mobile Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="inline-flex rounded-xl border border-violet-100 bg-white p-2 text-zinc-600 transition hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* CTA Button - Hidden on extra small mobile screen, visible on sm and up */}
            <button
              onClick={() => {
                onOpenBooking();
                closeMenu();
              }}
              className="hidden rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-800 active:translate-y-0 sm:inline-block"
            >
              Pesan Survey
            </button>

            {/* Mobile Hamburger / X Button */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex rounded-xl border border-zinc-200 p-2 text-zinc-600 transition hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 md:hidden"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Absolute Overlay) */}
        <div
          className={`absolute left-0 top-full w-full border-b border-violet-100 bg-white/90 backdrop-blur-md shadow-xl transition-all duration-300 ease-in-out md:hidden dark:border-zinc-800 dark:bg-black/90 ${
            menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <nav className="px-4 pb-4 pt-2">
            <div className="flex flex-col gap-1">
              <a
                href="#beranda"
                onClick={closeMenu}
                className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-violet-50 hover:text-violet-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                Beranda
              </a>
              <a
                href="#harga"
                onClick={closeMenu}
                className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-violet-50 hover:text-violet-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                Harga
              </a>
              <a
                href="#testimoni"
                onClick={closeMenu}
                className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-violet-50 hover:text-violet-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                Testimoni
              </a>
              <a
                href="#faq"
                onClick={closeMenu}
                className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-violet-50 hover:text-violet-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                FAQ
              </a>

              {/* Extra CTA in Mobile Dropdown for small viewports */}
              <div className="mt-2 border-t border-violet-100 pt-3 dark:border-zinc-800">
                <button
                  onClick={() => {
                    onOpenBooking();
                    closeMenu();
                  }}
                  className="w-full rounded-full bg-violet-700 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 active:scale-95"
                >
                  Pesan Survey Sekarang
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
