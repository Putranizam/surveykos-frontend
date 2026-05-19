import type { BookingRecord } from "@/src/lib/booking-types";

export async function sendBookingWebhook(event: string, booking: BookingRecord) {
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;

  if (!webhookUrl) {
    return { sent: false, reason: "BOOKING_WEBHOOK_URL belum diset." };
  }

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    booking,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { sent: false, reason: `Webhook gagal: ${response.status}` };
    }

    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      reason: error instanceof Error ? error.message : "Gagal kirim webhook.",
    };
  }
}

export function buildBookingWhatsAppUrl(booking: BookingRecord): string {
  const phone = process.env.WHATSAPP_NUMBER ?? "6281217052097";

  const message = [
    "Permintaan Survey Kos",
    `- ID Booking: ${booking.id}`,
    `- Nama Lengkap: ${booking.fullName}`,
    `- Area Tujuan di Malang: ${booking.targetArea}`,
    `- Paket Survey: ${booking.surveyPackage}`,
    `- Nama Kos: ${booking.boardingName || "Belum ada referensi"}`,
    `- Tanggal Survey Diinginkan: ${booking.surveyDate}`,
    `- Catatan Tambahan: ${booking.notes || "Tidak ada"}`,
  ].join("\n");

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}
