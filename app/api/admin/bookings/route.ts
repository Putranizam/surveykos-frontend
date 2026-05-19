import { NextResponse } from "next/server";
import { ensureAdmin } from "@/src/lib/admin-auth";
import { listBookings } from "@/src/lib/booking-store";

export async function GET(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  const url = new URL(request.url);
  const status = (url.searchParams.get("status") || "").trim();
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();

  const bookings = await listBookings();
  const filtered = bookings.filter((item) => {
    const statusMatch = status ? item.status === status : true;
    const text = `${item.fullName} ${item.targetArea} ${item.surveyPackage} ${item.id}`.toLowerCase();
    const queryMatch = q ? text.includes(q) : true;
    return statusMatch && queryMatch;
  });

  return NextResponse.json({
    total: filtered.length,
    items: filtered,
  });
}
