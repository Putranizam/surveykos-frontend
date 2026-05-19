"use client";

import { useState, useEffect } from "react";
import { Menu, X, MapPinCheck } from "lucide-react";

type HeaderProps = {
  onOpenBooking: () => void;
};

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Harga", href: "#harga" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "FAQ", href: "#faq" },
];

export function Header({ onOpenBooking }: HeaderProps) {
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
      {/* Inject keyframe once */}
      <style>{`
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu-open {
          animation: mobileMenuIn 0.22s ease forwards;
        }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(237,233,254,0.8)",
          backgroundColor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {/* ── Top bar ── */}
        <div
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={closeMenu}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <span
              style={{
                borderRadius: 8,
                backgroundColor: "#6d28d9",
                padding: 8,
                color: "#fff",
                display: "inline-flex",
              }}
            >
              <MapPinCheck style={{ width: 16, height: 16 }} />
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#18181b",
              }}
            >
              SurveyKos.id
            </span>
          </a>

          {/* Desktop nav — hidden on < 768px via media query */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="desktop-nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* CTA button — always visible */}
            <button
              onClick={() => {
                onOpenBooking();
                closeMenu();
              }}
              style={{
                borderRadius: 9999,
                backgroundColor: "#6d28d9",
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Pesan Survey
            </button>

            {/* Hamburger — always in DOM, hidden on desktop via CSS */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              className="hamburger-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                border: "1px solid #e4e4e7",
                padding: 8,
                color: "#52525b",
                backgroundColor: menuOpen ? "#f5f3ff" : "#ffffff",
                cursor: "pointer",
              }}
            >
              {menuOpen ? (
                <X style={{ width: 20, height: 20 }} />
              ) : (
                <Menu style={{ width: 20, height: 20 }} />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown — always in DOM, hidden via CSS ── */}
        <nav
          className={`mobile-menu ${menuOpen ? "mobile-menu--open mobile-menu-open" : ""}`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="mobile-menu-link"
            >
              {link.label}
            </a>
          ))}
          <div className="mobile-menu-divider">
            <button
              onClick={() => {
                onOpenBooking();
                closeMenu();
              }}
              className="mobile-menu-cta"
            >
              Pesan Survey Sekarang
            </button>
          </div>
        </nav>

        {/* Scoped CSS — no Tailwind dependency */}
        <style>{`
          /* Desktop nav */
          .desktop-nav {
            display: none;
            align-items: center;
            gap: 28px;
          }
          .desktop-nav-link {
            font-size: 14px;
            color: #3f3f46;
            text-decoration: none;
            transition: color 0.15s;
          }
          .desktop-nav-link:hover { color: #6d28d9; }

          /* Hamburger */
          .hamburger-btn { display: inline-flex; }

          /* Mobile menu */
          .mobile-menu {
            display: none;
            flex-direction: column;
            gap: 4px;
            border-top: 1px solid #ede9fe;
            background: #fff;
            padding: 8px 16px 16px;
          }
          .mobile-menu--open { display: flex; }
          .mobile-menu-link {
            display: block;
            padding: 12px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 500;
            color: #3f3f46;
            text-decoration: none;
            transition: background 0.15s, color 0.15s;
          }
          .mobile-menu-link:hover,
          .mobile-menu-link:active {
            background: #f5f3ff;
            color: #6d28d9;
          }
          .mobile-menu-divider {
            border-top: 1px solid #ede9fe;
            margin-top: 8px;
            padding-top: 12px;
          }
          .mobile-menu-cta {
            width: 100%;
            border-radius: 9999px;
            background: #6d28d9;
            padding: 10px 0;
            font-size: 14px;
            font-weight: 600;
            color: #fff;
            border: none;
            cursor: pointer;
          }
          .mobile-menu-cta:active { opacity: 0.85; }

          /* ── Responsive breakpoint ── */
          @media (min-width: 768px) {
            .desktop-nav   { display: flex; }
            .hamburger-btn { display: none !important; }
            .mobile-menu   { display: none !important; }
          }
        `}</style>
      </header>
    </>
  );
}
