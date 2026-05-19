import { NextResponse } from "next/server";
import { createBooking } from "@/src/lib/booking-store";
import { parseBookingPayload } from "@/src/lib/booking-validation";
import { buildBookingWhatsAppUrl, sendBookingWebhook } from "@/src/lib/notifications";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = parseBookingPayload(payload);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const booking = await createBooking(parsed.data);
    const webhookResult = await sendBookingWebhook("booking.created", booking);
    const whatsappUrl = buildBookingWhatsAppUrl(booking);

    return NextResponse.json(
      {
        success: true,
        booking,
        whatsappUrl,
        webhook: webhookResult,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses booking." },
      { status: 500 },
    );
  }
}
