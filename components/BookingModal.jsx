"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

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

const WHATSAPP_PHONE = "6281217052097";

export function BookingModal({ onClose, defaultPackage = null }) {
  const [fullName, setFullName] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [surveyPackage, setSurveyPackage] = useState(defaultPackage?.name || "");
  const [boardingName, setBoardingName] = useState("");
  const [surveyDate, setSurveyDate] = useState("");
  const [notes, setNotes] = useState("");

  const minSurveyDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = [
      "Permintaan Survey Kos",
      "- Nama Lengkap: " + fullName,
      "- Area Tujuan di Malang: " + targetArea,
      "- Paket Survey: " + surveyPackage,
      "- Nama Kos: " + (boardingName || "Belum ada referensi"),
      "- Tanggal Survey Diinginkan: " + surveyDate,
      "- Catatan Tambahan: " + (notes || "Tidak ada"),
    ].join("\n");

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
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
              <span className="mb-2 block text-sm font-medium text-zinc-800">
                Nama Lengkap <span className="text-rose-600">*</span>
              </span>
              <input
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="cth: Budi Santoso"
                className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
            </label>

            <div>
              <p className="mb-2 text-sm font-medium text-zinc-800">
                Area Tujuan di Malang <span className="text-rose-600">*</span>
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
                          ? "bg-violet-700 text-white"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-zinc-800">
                Paket Survey <span className="text-rose-600">*</span>
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
                          ? "border-violet-600 bg-violet-50"
                          : "border-zinc-200 bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            active
                              ? "border-violet-700 bg-violet-700"
                              : "border-zinc-300 bg-white"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              active ? "bg-white" : "bg-transparent"
                            }`}
                          />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{pkg.name}</p>
                          <p className="text-xs text-zinc-600">{pkg.price}</p>
                        </div>
                      </div>
                      {pkg.popular ? (
                        <span className="rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-semibold text-zinc-900">
                          Terpopuler
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-800">Nama Kos</span>
              <input
                value={boardingName}
                onChange={(event) => setBoardingName(event.target.value)}
                placeholder="Jika sudah ada referensi kos tertentu"
                className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-800">
                Tanggal Survey Diinginkan <span className="text-rose-600">*</span>
              </span>
              <input
                required
                type="date"
                min={minSurveyDate}
                value={surveyDate}
                onChange={(event) => setSurveyDate(event.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Estimasi mulai survey H+1 setelah konfirmasi pembayaran
              </p>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-800">
                Catatan Tambahan
              </span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="cth: Preferensi kos putri, budget maks Rp 1 juta/bulan, ada kamar mandi dalam..."
                rows={4}
                className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
            </label>

            <button
              type="submit"
              disabled={!targetArea || !surveyPackage}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-800 px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Kirim & Lanjut ke WhatsApp
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
      </div>
    </div>
  );
}
