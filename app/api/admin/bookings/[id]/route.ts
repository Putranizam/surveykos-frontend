import { NextResponse } from "next/server";
import { ensureAdmin } from "@/src/lib/admin-auth";
import { isBookingStatus, updateBooking, findBookingById } from "@/src/lib/booking-store";
import { sendBookingWebhook } from "@/src/lib/notifications";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    const payload = (await request.json()) as {
      status?: string;
      notes?: string;
      surveyDate?: string;
      boardingName?: string;
    };

    const patch: {
      status?: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
      notes?: string;
      surveyDate?: string;
      boardingName?: string;
    } = {};

    if (typeof payload.status === "string") {
      if (!isBookingStatus(payload.status)) {
        return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
      }

      patch.status = payload.status;
    }

    if (typeof payload.notes === "string") patch.notes = payload.notes.trim();
    if (typeof payload.surveyDate === "string") patch.surveyDate = payload.surveyDate.trim();
    if (typeof payload.boardingName === "string") patch.boardingName = payload.boardingName.trim();

    const updated = await updateBooking(id, patch);

    if (!updated) {
      return NextResponse.json({ error: "Booking tidak ditemukan." }, { status: 404 });
    }

    // Kirim webhook jika status berubah
    if (patch.status) {
      const eventType = `booking.${patch.status}`;
      await sendBookingWebhook(eventType, updated);
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch {
    return NextResponse.json({ error: "Gagal update booking." }, { status: 500 });
  }
}
