import { NextResponse } from "next/server";
import { ensureAdmin } from "@/src/lib/admin-auth";
import { listTestimonials } from "@/src/lib/admin-store";

export async function GET(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const testimonials = await listTestimonials();
    
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "";

    const filtered = status
      ? testimonials.filter((t) => t.status === status)
      : testimonials;

    return NextResponse.json({
      total: filtered.length,
      items: filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat testimonial." },
      { status: 500 }
    );
  }
}
