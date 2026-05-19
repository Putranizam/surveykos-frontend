"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { MessageSquareQuote, Star, Send, X, User, MapPin, Quote, Loader2, CheckCircle2 } from "lucide-react";

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};


function StarRating({ rating, interactive = false, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={`transition-transform duration-200 ${
            interactive
              ? "cursor-pointer hover:scale-125 active:scale-95"
              : "cursor-default"
          }`}
          aria-label={`${star} bintang`}
        >
          <Star
            className={`h-4 w-4 transition-colors duration-200 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-zinc-200 text-zinc-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.article
      {...reveal}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex flex-col rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      {/* Decorative quote */}
      <Quote className="absolute top-4 right-4 h-8 w-8 text-violet-100 transition-colors duration-300 group-hover:text-violet-200 dark:text-zinc-800 dark:group-hover:text-zinc-700" />

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={testimonial.rating || 5} />
      </div>

      {/* Quote text */}
      <p className="relative z-10 mb-5 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
          {testimonial.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{testimonial.name}</p>
          <p className="flex items-center gap-1 text-xs text-zinc-500">
            <MapPin className="h-3 w-3" />
            {testimonial.location}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function TestimonialFormModal({ isOpen, onClose, onSubmitted }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, quote, rating }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Gagal mengirim testimoni.");
        return;
      }

      setIsSuccess(true);

      // Notify parent with the newly created testimonial
      onSubmitted?.({
        id: data.data?.id || Date.now().toString(),
        name,
        location,
        quote,
        rating,
      });

      // Reset form and close after a brief success animation
      setTimeout(() => {
        setName("");
        setLocation("");
        setQuote("");
        setRating(5);
        setIsSuccess(false);
        onClose();
      }, 1500);
    } catch {
      setError("Terjadi kendala jaringan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 dark:border dark:border-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-700 to-indigo-800 px-6 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <MessageSquareQuote className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tulis Testimoni</h3>
                  <p className="text-sm text-violet-200">
                    Bagikan pengalamanmu menggunakan SurveyKos.id
                  </p>
                </div>
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

          {/* Form Body */}
          {isSuccess ? (
            <div className="flex flex-col items-center gap-4 px-6 py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              </motion.div>
              <p className="text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Terima kasih! 🎉
              </p>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Testimoni kamu berhasil dikirim dan langsung tampil di halaman.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-300">
                  <User className="mr-1 inline h-4 w-4 text-violet-600 dark:text-violet-500" />
                  Nama Lengkap <span className="text-rose-600 dark:text-rose-500">*</span>
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth: Budi Santoso"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-violet-500/50"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-300">
                  <MapPin className="mr-1 inline h-4 w-4 text-violet-600 dark:text-violet-500" />
                  Asal Kota <span className="text-rose-600 dark:text-rose-500">*</span>
                </span>
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="cth: Jakarta"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-violet-500/50"
                />
              </label>

              <div>
                <span className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-300">
                  <Star className="mr-1 inline h-4 w-4 text-violet-600 dark:text-violet-500" />
                  Rating <span className="text-rose-600 dark:text-rose-500">*</span>
                </span>
                <div className="flex items-center gap-2">
                  <StarRating rating={rating} interactive onChange={setRating} />
                  <span className="text-sm text-zinc-500">({rating}/5)</span>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-800 dark:text-zinc-300">
                  <Quote className="mr-1 inline h-4 w-4 text-violet-600 dark:text-violet-500" />
                  Testimoni <span className="text-rose-600 dark:text-rose-500">*</span>
                </span>
                <textarea
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Ceritakan pengalamanmu menggunakan layanan SurveyKos.id..."
                  rows={4}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-violet-500/50"
                />
              </label>

              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-800 px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Kirim Testimoni
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleNewTestimonial = (newItem) => {
    setTestimonials((prev) => [...prev, newItem]);
  };

  return (
    <section id="testimoni" className="relative overflow-hidden bg-gradient-to-b from-white via-violet-50/40 to-white dark:from-black dark:via-zinc-950 dark:to-black">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.06),transparent_40%),radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.06),transparent_40%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-18 md:px-6">
        {/* Header */}
        <motion.div {...reveal} className="mb-12 text-center" transition={{ duration: 0.4 }}>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/50 dark:text-violet-400">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Testimoni Pelanggan
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-100">
            Apa Kata Mereka?
          </h2>
          <p className="mt-3 text-sm text-zinc-600 md:text-base dark:text-zinc-400">
            Pengalaman nyata dari mahasiswa yang sudah menggunakan layanan kami.
          </p>
        </motion.div>

        {/* Testimonial cards grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* CTA button to add testimonial */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <button
            onClick={() => setIsFormOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <MessageSquareQuote className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            Tulis Testimoni Kamu
          </button>
          <p className="text-xs text-zinc-500">
            Sudah pernah pakai layanan kami? Yuk, bagikan pengalamanmu!
          </p>
        </motion.div>
      </div>

      {/* Form Modal */}
      <TestimonialFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitted={handleNewTestimonial}
      />
    </section>
  );
}
