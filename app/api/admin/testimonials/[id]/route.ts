import { NextResponse } from "next/server";
import { ensureAdmin } from "@/src/lib/admin-auth";
import { updateTestimonialStatus, deleteTestimonial } from "@/src/lib/admin-store";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    const { status } = await request.json();

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid." },
        { status: 400 }
      );
    }

    const updated = await updateTestimonialStatus(id, status);

    if (!updated) {
      return NextResponse.json(
        { error: "Testimonial tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    // Menampilkan error asli di log server Vercel
    console.error(`🔥 Error Fatal saat PATCH testimonial ID ${id}:`, error);

    return NextResponse.json(
      { 
        error: "Gagal update testimonial.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    const deleted = await deleteTestimonial(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Testimonial tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Menampilkan error asli di log server Vercel
    console.error(`🔥 Error Fatal saat DELETE testimonial ID ${id}:`, error);

    return NextResponse.json(
      { 
        error: "Gagal hapus testimonial.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}