import { NextResponse } from "next/server";
import { ensureAdmin } from "@/src/lib/admin-auth";
import { listFinances, createFinance, getFinanceSummary } from "@/src/lib/admin-store";

export async function GET(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "";
    const summary = url.searchParams.get("summary") === "true";

    if (summary) {
      const financeSummary = await getFinanceSummary();
      return NextResponse.json(financeSummary);
    }

    const finances = await listFinances();

    const filtered = type
      ? finances.filter((f) => f.type === type)
      : finances;

    return NextResponse.json({
      total: filtered.length,
      items: filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat keuangan." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { type, description, amount, date, category, notes } = body;

    if (!type || !description || amount === undefined || !date) {
      return NextResponse.json(
        { error: "Field wajib: type, description, amount, date" },
        { status: 400 }
      );
    }

    const finance = await createFinance({
      type,
      description,
      amount: parseFloat(amount),
      date,
      category,
      notes,
    });

    return NextResponse.json({ success: true, finance }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal tambah data keuangan." },
      { status: 500 }
    );
  }
}


