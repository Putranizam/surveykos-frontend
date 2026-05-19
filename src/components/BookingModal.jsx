"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { motion } from "framer-motion";

const AREA_OPTIONS = [
  "Suhat",
  "Sigura-gura",
  "Soekarno Hatta",
  "Dinoyo",
  "Ketawanggede",
  "Lainnya",
];

const PACKAGE_OPTIONS = [
  { name: "Paket Visit", price: "Rp 20.000" },
  { name: "Paket Reguler", price: "Rp 50.000" },
  { name: "Paket Unlimited", price: "Rp 100.000", popular: true },
];

export function BookingModal({ onClose, defaultPackage = null }) {
  const [fullName, setFullName] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [surveyPackage, setSurveyPackage] = useState(defaultPackage?.name || "");
  const [boardingName, setBoardingName] = useState("");
  const [surveyDate, setSurveyDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const minSurveyDate = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const previewText = useMemo(() => {
    return [
      "Preview Chat:",
      `Nama: ${fullName || "-"}`,
      `Area: ${targetArea || "-"}`,
      `Paket: ${surveyPackage || "-"}`,
      `Tanggal: ${surveyDate || "-"}`,
    ].join(" | ");
  }, [fullName, surveyDate, surveyPackage, targetArea]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          targetArea,
          surveyPackage,
          boardingName,
          surveyDate,
          notes,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setErrorMessage(payload?.error || "Gagal mengirim booking.");
        return;
      }

      if (payload?.whatsappUrl) {
        window.open(payload.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      onClose();
    } catch {
      setErrorMessage("Terjadi kendala jaringan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:border dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-violet-700 to-indigo-800 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Pesan Survey Kos</h2>
              <p className="mt-1 text-sm text-violet-100">
                Isi form - Simpan data - Konfirmasi via WhatsApp
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/90 transition hover:bg-white/15 hover:text-white"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-300">
                Nama Lengkap <span className="text-rose-600 dark:text-rose-500">*</span>
              </span>
              <input
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="cth: Budi Santoso"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-violet-500/50"
              />
            </label>

            <div>
              <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-300">
                Area Tujuan di Malang <span className="text-rose-600 dark:text-rose-500">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {AREA_OPTIONS.map((area) => {
                  const active = targetArea === area;
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setTargetArea(area)}
                      className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-violet-700 text-white dark:bg-violet-600"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-300">
                Paket Survey <span className="text-rose-600 dark:text-rose-500">*</span>
              </p>
              <div className="space-y-2">
                {PACKAGE_OPTIONS.map((pkg) => {
                  const active = surveyPackage === pkg.name;
                  return (
                    <button
                      key={pkg.name}
                      type="button"
                      onClick={() => setSurveyPackage(pkg.name)}
                      className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                        active
                          ? "border-violet-600 bg-violet-50 dark:border-violet-500 dark:bg-violet-900/20"
                          : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            active
                              ? "border-violet-700 bg-violet-700 dark:border-violet-500 dark:bg-violet-500"
                              : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              active ? "bg-white" : "bg-transparent"
                            }`}
                          />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{pkg.name}</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">{pkg.price}</p>
                        </div>
                      </div>
                      {pkg.popular ? (
                        <span className="rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-semibold text-zinc-900 dark:bg-yellow-500/20 dark:text-yellow-400">
                          Terpopuler
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-300">Nama Kos</span>
              <input
                value={boardingName}
                onChange={(event) => setBoardingName(event.target.value)}
                placeholder="Jika sudah ada referensi kos tertentu"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-violet-500/50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-300">
                Tanggal Survey Diinginkan <span className="text-rose-600 dark:text-rose-500">*</span>
              </span>
              <input
                required
                type="date"
                min={minSurveyDate}
                value={surveyDate}
                onChange={(event) => setSurveyDate(event.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-violet-500/50"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Estimasi mulai survey H+1 setelah konfirmasi pembayaran
              </p>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-300">
                Catatan Tambahan
              </span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="cth: Preferensi kos putri, budget maks Rp 1 juta/bulan, ada kamar mandi dalam..."
                rows={4}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-violet-500/50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-300">Preview Pesan WhatsApp</span>
              <textarea
                disabled
                value={previewText}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                rows={3}
              />
            </label>

            {errorMessage ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!targetArea || !surveyPackage || isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-800 px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Mengirim..." : "Kirim & Lanjut ke WhatsApp"}
            </button>

            <div className="flex items-start gap-2 text-xs text-zinc-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
              <p>
                Data tersimpan aman di server kami. Kami akan mengarahkan ke
                WhatsApp untuk konfirmasi jadwal & pembayaran.
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
