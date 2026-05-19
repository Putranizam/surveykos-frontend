import { NextResponse } from "next/server";
import { ensureAdmin } from "@/src/lib/admin-auth";
import { findBookingById } from "@/src/lib/booking-store";
import { sendBookingWebhook } from "@/src/lib/notifications";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  const booking = await findBookingById(id);

  if (!booking) {
    return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
  }

  const webhook = await sendBookingWebhook("booking.manual_notify", booking);

  return NextResponse.json({ success: true, webhook, bookingId: booking.id });
}
