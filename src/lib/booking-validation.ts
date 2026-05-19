import type { BookingInput } from "@/src/lib/booking-types";

type ParseResult =
  | { ok: true; data: BookingInput }
  | { ok: false; error: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseBookingPayload(payload: unknown): ParseResult {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Payload tidak valid." };
  }

  const data = payload as Record<string, unknown>;

  const fullName = normalizeString(data.fullName);
  const targetArea = normalizeString(data.targetArea);
  const surveyPackage = normalizeString(data.surveyPackage);
  const boardingName = normalizeString(data.boardingName);
  const surveyDate = normalizeString(data.surveyDate);
  const notes = normalizeString(data.notes);

  if (!fullName || fullName.length < 3) {
    return { ok: false, error: "Nama lengkap minimal 3 karakter." };
  }

  if (!targetArea) {
    return { ok: false, error: "Area tujuan wajib diisi." };
  }

  if (!surveyPackage) {
    return { ok: false, error: "Paket survey wajib dipilih." };
  }

  if (!surveyDate || !DATE_RE.test(surveyDate)) {
    return { ok: false, error: "Tanggal survey tidak valid." };
  }

  const minDate = getTomorrowDate();
  if (surveyDate < minDate) {
    return { ok: false, error: "Tanggal survey minimal H+1 dari hari ini." };
  }

  return {
    ok: true,
    data: {
      fullName,
      targetArea,
      surveyPackage,
      boardingName,
      surveyDate,
      notes,
    },
  };
}

export function getTomorrowDate(): string {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
