import { NextResponse } from "next/server";
import { ensureAdmin } from "@/src/lib/admin-auth";
import { updateFinance, deleteFinance } from "@/src/lib/admin-store";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await context.params;

  try {
    const body = await request.json();
    const updated = await updateFinance(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Data keuangan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, finance: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal update data keuangan." },
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
    const deleted = await deleteFinance(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Data keuangan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal hapus data keuangan." },
      { status: 500 }
    );
  }
}
