import fs from "fs";
import path from "path";

// SOLUSI VERCEL: Mengalihkan penyimpanan dari folder project ke folder serverless temporary (/tmp)
const filePath = path.join("/tmp", "bookings.json");

// Fungsi pembantu untuk memastikan file JSON selalu siap dibaca/ditulis tanpa error
function initializeFile() {
  try {
    if (!fs.existsSync(filePath)) {
      // Jika file belum ada di folder /tmp, buat file baru dengan array kosong []
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("⚠️ Gagal menginisialisasi file di /tmp:", error);
  }
}

export async function createBooking(data: any) {
  // Pastikan file pembungkusnya sudah siap di folder temporary Vercel
  initializeFile();

  try {
    // 1. Baca data lama dari folder /tmp
    const fileData = fs.readFileSync(filePath, "utf-8");
    const bookings = JSON.parse(fileData || "[]");

    // 2. Buat objek data booking baru lengkap dengan ID dan Timestamp
    const newBooking = {
      id: `book_${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };

    // 3. Masukkan data baru ke dalam list array
    bookings.push(newBooking);

    // 4. Tulis kembali ke dalam folder /tmp (Vercel mengizinkan penulisan di folder ini!)
    fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2), "utf-8");

    // Kembalikan data booking yang sukses dibuat agar bisa dibaca oleh API Route dan Webhook Render
    return newBooking;

  } catch (error) {
    console.error("❌ Gagal menyimpan data ke store lokal (/tmp):", error);
    throw new Error(error instanceof Error ? error.message : "Gagal memproses file database.");
  }
}