require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// ==========================================
// 1. CONFIGURATIONS & ENVIRONMENT VARIABLES
// ==========================================
const PORT = process.env.PORT || 3001;
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "628XXXXXXXXXX";

// Di server Render (Production), tulis file harus diarahkan ke folder /tmp
const LOGS_DIR = process.env.NODE_ENV === "production" 
  ? "/tmp/logs" 
  : path.join(__dirname, "logs");

// Pastikan folder logs tersedia
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// ==========================================
// 2. MIDDLEWARES (CORS & JSON PARSER)
// ==========================================
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL, // Diisi URL Vercel kamu di dashboard Render
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================
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

function logNotification(event, booking, message) {
  const logFile = path.join(LOGS_DIR, `notifications-${new Date().toISOString().split("T")[0]}.json`);
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    bookingId: booking.id,
    phoneNumber: WHATSAPP_NUMBER,
    message,
  };

  try {
    let logs = [];
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, "utf-8");
      logs = JSON.parse(content || "[]");
    }
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error("❌ Error logging notification:", error.message);
  }
}

// ==========================================
// 4. API ROUTING / ENDPOINTS
// ==========================================

// Webhook Endpoint
app.post("/webhook/booking", (req, res) => {
  try {
    const { event, booking } = req.body;

    if (!event || !booking) {
      return res.status(400).json({
        success: false,
        error: "Field 'event' dan 'booking' wajib diisi",
      });
    }

    console.log(`\n📬 Webhook masuk: [${event}] ID: ${booking.id} (${booking.fullName})`);

    const message = formatBookingMessage(booking, event);
    logNotification(event, booking, message);

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
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get All Notifications Log
app.get("/notifications", (req, res) => {
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      return res.json({ total: 0, notifications: [] });
    }

    const files = fs.readdirSync(LOGS_DIR).filter((f) => f.endsWith(".json"));
    const allNotifications = [];

    files.forEach((file) => {
      try {
        const content = fs.readFileSync(path.join(LOGS_DIR, file), "utf-8");
        allNotifications.push(...JSON.parse(content || "[]"));
      } catch (parseErr) {
        console.warn(`⚠️ Gagal membaca file log: ${file}`);
      }
    });

    res.json({
      total: allNotifications.length,
      notifications: allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mode: process.env.NODE_ENV || "development",
    whatsappNumber: WHATSAPP_NUMBER,
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// 404 Fallback Handler
app.use((req, res) => {
  res.status(404).json({ error: `Rute ${req.method} ${req.path} tidak ditemukan` });
});

// ==========================================
// 5. SERVER INITIALIZATION & SHUTDOWN
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend Server ready on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
});

// Handle Port Collision Error
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ ERROR: Port ${PORT} sudah digunakan proses lain!`);
  } else {
    console.error("❌ Server error:", err.message);
  }
  process.exit(1);
});

// Graceful Shutdown
process.on("SIGINT", () => {
  server.close(() => {
    console.log("✅ Server berhasil dimatikan secara aman.");
    process.exit(0);
  });
});