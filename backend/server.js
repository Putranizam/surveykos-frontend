require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// CORS Configuration - Updated untuk production di Infinity Hosting
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "https://survey-kos-frontend.infinityfreeapp.com",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 3001;
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "628XXXXXXXXXX";
const LOGS_DIR = path.join(__dirname, "logs");

// Buat folder logs jika belum ada
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Format booking data untuk notifikasi
function formatBookingMessage(booking, event) {
  const eventLabel = {
    "booking.created": "📝 BOOKING BARU",
    "booking.confirmed": "✅ BOOKING DIKONFIRMASI",
    "booking.in_progress": "🔄 SURVEY SEDANG BERLANGSUNG",
    "booking.completed": "✨ SURVEY SELESAI",
    "booking.cancelled": "❌ BOOKING DIBATALKAN",
    "booking.manual_notify": "🔔 NOTIFIKASI MANUAL",
  }[event] || event;

  return `
${eventLabel}

📋 *Detail Booking*
• ID: ${booking.id}
• Nama: ${booking.fullName}
• Area: ${booking.targetArea}
• Paket: ${booking.surveyPackage}
• Kos: ${booking.boardingName || "-"}
• Tanggal: ${booking.surveyDate}
• Status: ${booking.status}
• Catatan: ${booking.notes || "-"}

Waktu: ${new Date().toLocaleString("id-ID")}
  `.trim();
}

// Log notifikasi ke file
function logNotification(event, booking, message) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    bookingId: booking.id,
    phoneNumber: WHATSAPP_NUMBER,
    message,
  };

  const logFile = path.join(
    LOGS_DIR,
    `notifications-${new Date().toISOString().split("T")[0]}.json`
  );

  try {
    let logs = [];
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, "utf-8");
      logs = JSON.parse(content);
    }
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error("Error logging notification:", error.message);
  }
}

// Webhook endpoint
app.post("/webhook/booking", async (req, res) => {
  try {
    const { event, booking } = req.body;

    // Validasi input
    if (!event || !booking) {
      return res.status(400).json({
        success: false,
        error: "Field 'event' dan 'booking' wajib diisi",
      });
    }

    console.log(`\n📬 Webhook diterima: ${event}`);
    console.log(`   Booking ID: ${booking.id}`);
    console.log(`   Nama: ${booking.fullName}`);
    console.log(`   Status: ${booking.status}`);

    // Format message
    const message = formatBookingMessage(booking, event);

    // Log ke file
    logNotification(event, booking, message);

    console.log("\n📱 Notifikasi yang akan dikirim ke WhatsApp:");
    console.log("─".repeat(50));
    console.log(message);
    console.log("─".repeat(50));
    console.log(
      `\n💾 Notifikasi tersimpan di: logs/notifications-${
        new Date().toISOString().split("T")[0]
      }.json`
    );

    res.json({
      success: true,
      event,
      bookingId: booking.id,
      message: "Notifikasi tercatat dan siap untuk dikirim ke WhatsApp",
      phoneNumber: WHATSAPP_NUMBER,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all notifications
app.get("/notifications", (req, res) => {
  try {
    const files = fs
      .readdirSync(LOGS_DIR)
      .filter((f) => f.endsWith(".json")); // hanya baca file JSON

    const allNotifications = [];

    files.forEach((file) => {
      try {
        const content = fs.readFileSync(path.join(LOGS_DIR, file), "utf-8");
        allNotifications.push(...JSON.parse(content));
      } catch (parseErr) {
        console.warn(`⚠️ Gagal membaca file log: ${file}`);
      }
    });

    res.json({
      total: allNotifications.length,
      notifications: allNotifications.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mode: "simple-logging",
    whatsappNumber: WHATSAPP_NUMBER,
    logsDirectory: LOGS_DIR,
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} tidak ditemukan` });
});

// Start server dengan error handling port bentrok
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Backend Server Berjalan          ║
║   Port: ${PORT}                            ║
║   Mode: Logging (WhatsApp Manual)     ║
║   WhatsApp: ${WHATSAPP_NUMBER}  ║
╚════════════════════════════════════════╝

📋 Endpoint:
  - POST   /webhook/booking     (Terima notifikasi)
  - GET    /notifications       (Lihat semua notifikasi)
  - GET    /health              (Status server)

📁 Notifikasi tersimpan di: ./logs/
  `);
});

// Handle port sudah dipakai
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ ERROR: Port ${PORT} sudah digunakan proses lain!`);
    console.error(`   Solusi:`);
    console.error(`   1. Jalankan: netstat -ano | findstr :${PORT}`);
    console.error(`   2. Kill PID-nya: taskkill /PID <nomor> /F`);
    console.error(`   3. Atau ganti port: set PORT=5002 && node server.js\n`);
  } else {
    console.error("❌ Server error:", err.message);
  }
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Server dimatikan dengan aman...");
  server.close(() => {
    console.log("✅ Server berhasil dimatikan.");
    process.exit(0);
  });
});