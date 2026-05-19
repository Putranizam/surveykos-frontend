"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
type TestimonialStatus = "pending" | "approved" | "rejected";
type FinanceType = "income" | "expense";

type Booking = {
  id: string;
  fullName: string;
  targetArea: string;
  surveyPackage: string;
  boardingName?: string;
  surveyDate: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

type Testimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  status: TestimonialStatus;
  createdAt: string;
  approvedAt?: string;
};

type Finance = {
  id: string;
  type: FinanceType;
  description: string;
  amount: number;
  date: string;
  category?: string;
  notes?: string;
  createdAt: string;
};

const STATUS_OPTIONS: BookingStatus[] = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

const statusLabel: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const testimonialStatusLabel: Record<TestimonialStatus, string> = {
  pending: "Menunggu Persetujuan",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export default function AdminPage() {
  const [tab, setTab] = useState<"bookings" | "testimonials" | "finances">("bookings");
  const [tokenInput, setTokenInput] = useState("");
  const [token, setToken] = useState("");
  const tokenRef = useRef("");
  const [statusFilter, setStatusFilter] = useState("");
  const [testimonialSearch, setTestimonialSearch] = useState("");
  const [expandedTestimonial, setExpandedTestimonial] = useState("");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [finances, setFinances] = useState<Finance[]>([]);
  const [financeSummary, setFinanceSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  // Keep tokenRef in sync
  useEffect(() => { tokenRef.current = token; }, [token]);

  // Auto-load token from localStorage on mount
  useEffect(() => {
    const saved = window.localStorage.getItem("admin_api_token") || "";
    if (saved.trim()) {
      setTokenInput(saved);
      setToken(saved.trim());
    }
  }, []);

  const canLoad = useMemo(() => token.trim().length > 0, [token]);

  const getToken = () => tokenRef.current;

  const loadBookings = useCallback(async () => {
    const t = getToken();
    if (!t) return;
    setLoading(true);
    setError("");
    try {
      const url = new URL("/api/admin/bookings", window.location.origin);
      if (statusFilter) url.searchParams.set("status", statusFilter);
      if (query.trim()) url.searchParams.set("q", query.trim());

      const response = await fetch(url.toString(), {
        headers: { "x-admin-token": t },
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Gagal memuat data booking.");
      setBookings(payload.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, query]);

  const loadTestimonials = useCallback(async () => {
    const t = getToken();
    if (!t) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/testimonials", {
        headers: { "x-admin-token": t },
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Gagal memuat testimonial.");
      setTestimonials(payload.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFinances = useCallback(async () => {
    const t = getToken();
    if (!t) return;
    setLoading(true);
    setError("");
    try {
      const [dataRes, summaryRes] = await Promise.all([
        fetch("/api/admin/finances", { headers: { "x-admin-token": t } }),
        fetch("/api/admin/finances?summary=true", { headers: { "x-admin-token": t } }),
      ]);

      const data = await dataRes.json();
      const summary = await summaryRes.json();

      if (!dataRes.ok) throw new Error(data?.error || "Gagal memuat keuangan.");
      setFinances(data.items || []);
      setFinanceSummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }, []);

  const applyToken = () => {
    const clean = tokenInput.trim();
    setToken(clean);
    tokenRef.current = clean;
    window.localStorage.setItem("admin_api_token", clean);
  };

  const useSavedToken = () => {
    const saved = window.localStorage.getItem("admin_api_token") || "";
    setTokenInput(saved);
    setToken(saved.trim());
    tokenRef.current = saved.trim();
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    const t = getToken();
    if (!t) { setError("Token belum diisi."); return; }
    setUpdatingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": t,
        },
        body: JSON.stringify({ status }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Gagal update status.");
      setBookings((prev) => prev.map((b) => (b.id === id ? payload.booking : b)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal update status.");
    } finally {
      setUpdatingId("");
    }
  };

  const updateTestimonialStatus = async (id: string, status: TestimonialStatus) => {
    const t = getToken();
    if (!t) { setError("Token belum diisi."); return; }
    setUpdatingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": t,
        },
        body: JSON.stringify({ status }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Gagal update testimonial.");
      setTestimonials((prev) => prev.map((t) => (t.id === id ? payload.testimonial : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal update testimonial.");
    } finally {
      setUpdatingId("");
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Hapus testimonial ini?")) return;
    const t = getToken();
    if (!t) { setError("Token belum diisi."); return; }
    setUpdatingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": t },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Gagal hapus testimonial.");
      }
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal hapus testimonial.");
    } finally {
      setUpdatingId("");
    }
  };

  const deleteFinance = async (id: string) => {
    if (!confirm("Hapus data keuangan ini?")) return;
    const t = getToken();
    if (!t) { setError("Token belum diisi."); return; }
    setUpdatingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/finances/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": t },
      });

      if (!response.ok) throw new Error("Gagal hapus data keuangan.");
      setFinances((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal hapus data keuangan.");
    } finally {
      setUpdatingId("");
    }
  };

  const sendNotify = async (id: string) => {
    const t = getToken();
    if (!t) { setError("Token belum diisi."); return; }
    setUpdatingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/bookings/${id}/notify`, {
        method: "POST",
        headers: { "x-admin-token": t },
      });

      if (!response.ok) throw new Error("Gagal mengirim notifikasi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal kirim notifikasi.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <main className="min-h-screen bg-black p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard Admin SurveyKos.id</h1>
          <p className="mt-1 text-sm text-zinc-400">Kelola booking, testimoni, dan keuangan.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Masukkan ADMIN_API_TOKEN"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              suppressHydrationWarning
            />
            <button
              onClick={applyToken}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
              suppressHydrationWarning
            >
              Simpan Token
            </button>
          </div>
          <button
            onClick={useSavedToken}
            className="mt-3 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
            suppressHydrationWarning
          >
            Gunakan Token Tersimpan
          </button>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950 shadow-sm">
          <div className="flex border-b border-zinc-900">
            <button
              onClick={() => {
                setTab("bookings");
                loadBookings();
              }}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                tab === "bookings" ? "border-b-2 border-violet-500 text-violet-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
              suppressHydrationWarning
            >
              📋 Bookings
            </button>
            <button
              onClick={() => {
                setTab("testimonials");
                loadTestimonials();
              }}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                tab === "testimonials" ? "border-b-2 border-violet-500 text-violet-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
              suppressHydrationWarning
            >
              ⭐ Testimoni
            </button>
            <button
              onClick={() => {
                setTab("finances");
                loadFinances();
              }}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                tab === "finances" ? "border-b-2 border-violet-500 text-violet-400" : "text-zinc-400 hover:text-zinc-200"
              }`}
              suppressHydrationWarning
            >
              💰 Keuangan
            </button>
          </div>

          <div className="p-5">
            {error && (
              <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
            )}

            {/* BOOKINGS TAB */}
            {tab === "bookings" && (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    suppressHydrationWarning
                  >
                    <option value="">Semua Status</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel[s]}
                      </option>
                    ))}
                  </select>

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari nama, area, paket, atau ID"
                    className="rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    suppressHydrationWarning
                  />

                  <button
                    onClick={loadBookings}
                    disabled={!canLoad || loading}
                    className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-700 transition-colors disabled:opacity-60"
                    suppressHydrationWarning
                  >
                    {loading ? "Memuat..." : "Muat Data"}
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-zinc-900">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-900 text-zinc-200">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Booking</th>
                        <th className="px-3 py-2 text-left font-semibold">Area/Paket</th>
                        <th className="px-3 py-2 text-left font-semibold">Tanggal</th>
                        <th className="px-3 py-2 text-left font-semibold">Status</th>
                        <th className="px-3 py-2 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-3 py-8 text-center text-zinc-600">
                            Belum ada data.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((b) => (
                          <tr key={b.id} className="border-t border-zinc-900">
                            <td className="px-3 py-2">
                              <p className="font-semibold text-zinc-100">{b.fullName}</p>
                              <p className="text-xs text-zinc-500">ID: {b.id}</p>
                            </td>
                            <td className="px-3 py-2">
                              <p className="text-zinc-300">{b.targetArea}</p>
                              <p className="text-xs text-zinc-500">{b.surveyPackage}</p>
                            </td>
                            <td className="px-3 py-2 text-zinc-300">{b.surveyDate}</td>
                            <td className="px-3 py-2">
                              <select
                                value={b.status}
                                disabled={updatingId === b.id}
                                onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                                className="rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                                suppressHydrationWarning
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>
                                    {statusLabel[s]}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <button
                                onClick={() => sendNotify(b.id)}
                                disabled={updatingId === b.id}
                                className="rounded-lg border border-violet-700/50 bg-violet-900/30 px-3 py-1 text-xs font-semibold text-violet-300 hover:bg-violet-900/50 hover:text-violet-200 transition-colors disabled:opacity-60"
                                suppressHydrationWarning
                              >
                                Notif
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TESTIMONIALS TAB */}
            {tab === "testimonials" && (() => {
              const avgRating = testimonials.length > 0 ? (testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length).toFixed(1) : "0";

              const filtered = testimonialSearch.trim()
                ? testimonials.filter((t) => {
                    const q = testimonialSearch.toLowerCase();
                    return t.name?.toLowerCase().includes(q) || t.location?.toLowerCase().includes(q) || t.quote?.toLowerCase().includes(q);
                  })
                : testimonials;

              return (
              <div className="space-y-5">
                {/* Stats */}
                <div className="grid gap-3 grid-cols-2 md:grid-cols-2">
                  <div className="rounded-xl border border-violet-800/50 bg-violet-900/20 p-4 text-center">
                    <p className="text-3xl font-bold text-violet-400">{testimonials.length}</p>
                    <p className="mt-1 text-sm text-violet-400/80">Total Testimoni</p>
                  </div>
                  <div className="rounded-xl border border-amber-800/50 bg-amber-900/20 p-4 text-center">
                    <p className="text-3xl font-bold text-amber-400">⭐ {avgRating}</p>
                    <p className="mt-1 text-sm text-amber-400/80">Rata-rata Rating</p>
                  </div>
                </div>

                {/* Search + Load */}
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    value={testimonialSearch}
                    onChange={(e) => setTestimonialSearch(e.target.value)}
                    placeholder="Cari nama, kota, atau isi testimoni..."
                    className="rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 placeholder-zinc-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                    suppressHydrationWarning
                  />
                  <button
                    onClick={loadTestimonials}
                    disabled={!canLoad || loading}
                    className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-700 transition-colors disabled:opacity-60"
                    suppressHydrationWarning
                  >
                    {loading ? "Memuat..." : "Muat Data"}
                  </button>
                </div>

                {/* Testimonials list */}
                {filtered.length === 0 ? (
                  <div className="rounded-lg border border-zinc-900 bg-zinc-900/30 px-3 py-10 text-center text-zinc-500">
                    {testimonials.length === 0 ? "Belum ada testimoni. Klik 'Muat Data' untuk memuat." : "Tidak ada testimoni yang cocok dengan pencarian."}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-zinc-900 bg-black p-4 transition hover:border-zinc-800"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Left: Avatar + Info */}
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                              {(t.name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-zinc-100 truncate">{t.name || "-"}</p>
                              <p className="text-xs text-zinc-400">📍 {t.location || "-"}</p>
                              <div className="mt-1 flex items-center gap-1.5">
                                <div className="flex gap-0.5">
                                  {[1,2,3,4,5].map((s) => (
                                    <span key={s} className={`text-xs ${s <= (t.rating || 5) ? "text-amber-400" : "text-zinc-700"}`}>★</span>
                                  ))}
                                </div>
                                <span className="text-xs text-zinc-500">{t.rating || 5}/5</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Delete button */}
                          <button
                            onClick={() => deleteTestimonial(t.id)}
                            disabled={updatingId === t.id}
                            className="shrink-0 rounded-lg border border-rose-700/50 bg-rose-900/30 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 hover:text-rose-200 transition-colors disabled:opacity-60"
                            suppressHydrationWarning
                          >
                            {updatingId === t.id ? "..." : "Hapus"}
                          </button>
                        </div>

                        {/* Quote */}
                        <div className="mt-3 rounded-lg bg-zinc-900/50 px-3 py-2.5">
                          <p className={`text-sm text-zinc-300 leading-relaxed ${expandedTestimonial === t.id ? "" : "line-clamp-2"}`}>
                            &ldquo;{t.quote || "-"}&rdquo;
                          </p>
                          {(t.quote || "").length > 80 && (
                            <button
                              onClick={() => setExpandedTestimonial(expandedTestimonial === t.id ? "" : t.id)}
                              className="mt-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                              suppressHydrationWarning
                            >
                              {expandedTestimonial === t.id ? "Sembunyikan" : "Selengkapnya"}
                            </button>
                          )}
                        </div>

                        {/* Date */}
                        <p className="mt-2 text-xs text-zinc-400">
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Result count */}
                {testimonials.length > 0 && (
                  <p className="text-xs text-zinc-500 text-right">Menampilkan {filtered.length} dari {testimonials.length} testimoni</p>
                )}
              </div>
              );
            })()}

            {/* FINANCES TAB */}
            {tab === "finances" && (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-emerald-800/50 bg-emerald-900/20 p-4">
                    <p className="text-sm text-emerald-400/80">Pemasukan</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-400">
                      Rp {financeSummary.totalIncome.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-rose-800/50 bg-rose-900/20 p-4">
                    <p className="text-sm text-rose-400/80">Pengeluaran</p>
                    <p className="mt-1 text-2xl font-bold text-rose-400">
                      Rp {financeSummary.totalExpense.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="rounded-lg border border-violet-800/50 bg-violet-900/20 p-4">
                    <p className="text-sm text-violet-400/80">Saldo Bersih</p>
                    <p className="mt-1 text-2xl font-bold text-violet-400">
                      Rp {financeSummary.netBalance.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-zinc-900">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-900 text-zinc-200">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Tanggal</th>
                        <th className="px-3 py-2 text-left font-semibold">Jenis</th>
                        <th className="px-3 py-2 text-left font-semibold">Deskripsi</th>
                        <th className="px-3 py-2 text-left font-semibold">Jumlah</th>
                        <th className="px-3 py-2 text-left font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finances.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-3 py-8 text-center text-zinc-600">
                            Belum ada data keuangan.
                          </td>
                        </tr>
                      ) : (
                        finances.map((f) => (
                          <tr key={f.id} className="border-t border-zinc-900">
                            <td className="px-3 py-2 text-zinc-300">{new Date(f.date).toLocaleDateString("id-ID")}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-semibold border ${
                                  f.type === "income"
                                    ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/50"
                                    : "bg-rose-900/30 text-rose-400 border-rose-800/50"
                                }`}
                              >
                                {f.type === "income" ? "Pemasukan" : "Pengeluaran"}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-zinc-300">{f.description}</td>
                            <td className="px-3 py-2 font-semibold text-zinc-100">
                              Rp {f.amount.toLocaleString("id-ID")}
                            </td>
                            <td className="px-3 py-2">
                              <button
                                onClick={() => deleteFinance(f.id)}
                                disabled={updatingId === f.id}
                                className="rounded-lg border border-rose-700/50 bg-rose-900/30 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-900/50 hover:text-rose-200 transition-colors disabled:opacity-60"
                                suppressHydrationWarning
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
