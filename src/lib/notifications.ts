import type { BookingRecord } from "@/src/lib/booking-types";

export async function sendBookingWebhook(event: string, booking: BookingRecord) {
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("⚠️ BOOKING_WEBHOOK_URL belum diset di Environment Variables.");
    return { sent: false, reason: "BOOKING_WEBHOOK_URL belum diset." };
  }

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    booking,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`❌ Webhook Render merespon dengan status: ${response.status}`);
      return { sent: false, reason: `Webhook gagal: ${response.status}` };
    }

    const data = await response.json().catch(() => ({}));
    return { sent: true, data };

  } catch (error) {
    clearTimeout(timeoutId);
    
    // Memberikan pesan log yang lebih informatif jika terkena Abort / Timeout akibat Render Sleep
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("⚠️ Webhook di-abort: Server Render terlalu lama terbangun dari mode tidur (Cold Start).");
      return { sent: false, reason: "Timeout: Server Render sedang mode tidur." };
    }

    console.error("❌ Gagal mengirim webhook ke Render:", error);
    return {
      sent: false,
      reason: error instanceof Error ? error.message : "Gagal kirim webhook.",
    };
  }
}

export function buildBookingWhatsAppUrl(booking: BookingRecord): string {
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281217052097";
  const phone = rawPhone.replace(/\D/g, "");

  const message = [
    "📌 *Permintaan Survey Kos Baru*",
    `• *ID Booking:* ${booking.id}`,
    `• *Nama Lengkap:* ${booking.fullName}`,
    `• *Area Tujuan (Malang):* ${booking.targetArea}`,
    `• *Paket Survey:* ${booking.surveyPackage}`,
    `• *Nama Kos:* ${booking.boardingName || "Belum ada referensi"}`,
    `• *Tanggal Survey:* ${booking.surveyDate}`,
    `• *Catatan Tambahan:* ${booking.notes || "Tidak ada"}`,
  ].join("\n");

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}