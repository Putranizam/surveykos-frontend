import path from "node:path";
import { promises as fs } from "node:fs";
import type { BookingInput, BookingRecord, BookingStatus } from "@/src/lib/booking-types";

// SOLUSI VERCEL: Alihkan dari process.cwd() ke folder temporary (/tmp) agar bisa Write/Edit file
const dataPath = path.join("/tmp", "bookings.json");

async function ensureStore() {
  try {
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    try {
      await fs.access(dataPath);
    } catch {
      // Jika file belum ada di /tmp, buat baru dengan array kosong
      await fs.writeFile(dataPath, "[]", "utf8");
    }
  } catch (error) {
    console.error("⚠️ Gagal memastikan store di /tmp:", error);
  }
}

async function readRaw(): Promise<BookingRecord[]> {
  await ensureStore();
  try {
    const content = await fs.readFile(dataPath, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? (parsed as BookingRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeRaw(bookings: BookingRecord[]) {
  try {
    await fs.writeFile(dataPath, JSON.stringify(bookings, null, 2), "utf8");
  } catch (error) {
    console.error("❌ Gagal menulis data ke /tmp:", error);
    throw error;
  }
}

export async function createBooking(input: BookingInput): Promise<BookingRecord> {
  const bookings = await readRaw();
  const now = new Date().toISOString();

  const record: BookingRecord = {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    targetArea: input.targetArea,
    surveyPackage: input.surveyPackage,
    boardingName: input.boardingName || "",
    surveyDate: input.surveyDate,
    notes: input.notes || "",
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  bookings.unshift(record);
  await writeRaw(bookings);
  return record;
}

export async function listBookings(): Promise<BookingRecord[]> {
  return readRaw();
}

export async function findBookingById(id: string): Promise<BookingRecord | null> {
  const bookings = await readRaw();
  return bookings.find((item) => item.id === id) ?? null;
}

export async function updateBooking(
  id: string,
  patch: Partial<Pick<BookingRecord, "status" | "notes" | "surveyDate" | "boardingName">>,
): Promise<BookingRecord | null> {
  const bookings = await readRaw();
  const index = bookings.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const next: BookingRecord = {
    ...bookings[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  bookings[index] = next;
  await writeRaw(bookings);
  return next;
}

export function isBookingStatus(value: string): value is BookingStatus {
  return ["pending", "confirmed", "in_progress", "completed", "cancelled"].includes(value);
}