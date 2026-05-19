import { NextResponse } from "next/server";
import { createBooking } from "@/src/lib/booking-store";
import { parseBookingPayload } from "@/src/lib/booking-validation";
import { buildBookingWhatsAppUrl, sendBookingWebhook } from "@/src/lib/notifications";

// WAJIB: Gunakan Named Export murni untuk HTTP Method.
// DILARANG keras ada 'export default' atau 'export const config' di file ini!
export async function POST(request: Request) {
  try {
    // 1. Ambil dan validasi data dari frontend
    const payload = await request.json();
    const parsed = parseBookingPayload(payload);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    // 2. Simpan data booking ke database (menggunakan folder /tmp yang aman)
    const booking = await createBooking(parsed.data);
    
    // 3. Buat URL WhatsApp
    const whatsappUrl = buildBookingWhatsAppUrl(booking);

    // 4. Kirim Webhook ke Render
    let webhookResult: any = { sent: false, reason: "Tidak dieksekusi" };
    try {
      webhookResult = await sendBookingWebhook("booking.created", booking);
    } catch (webhookError) {
      console.error("⚠️ Gagal mengirim webhook ke Render (tapi booking aman):", webhookError);
      webhookResult = { 
        sent: false, 
        reason: webhookError instanceof Error ? webhookError.message : "Internal webhook error" 
      };
    }

    // 5. Kembalikan respon sukses ke frontend
    return NextResponse.json(
      {
        success: true,
        booking,
        whatsappUrl,
        webhook: webhookResult,
      },
      { status: 201 },
    );

  } catch (error) {
    console.error("🔥 Error Fatal pada API Route /api/booking:", error);

    return NextResponse.json(
      { 
        error: "Gagal memproses booking.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 },
    );
  }
}