# Backend Webhook Server - SurveyKos.id

Server untuk menangani notifikasi booking dan mengirim pesan WhatsApp otomatis.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Konfigurasi .env

Edit file `backend/.env`:

```env
PORT=5000
WHATSAPP_NUMBER=628XXXXXXXXXX
```

Ganti `628XXXXXXXXXX` dengan nomor WhatsApp Anda.

### 3. Jalankan Server

```bash
npm start
```

atau untuk development dengan auto-reload:

```bash
npm run dev
```

### 4. Login WhatsApp

Saat server dimulai, akan muncul **QR code** di terminal. Scan dengan WhatsApp Anda untuk login.

```
📱 Scan QR code dengan WhatsApp Anda:
[QR CODE AKAN MUNCUL]
```

Setelah scan, tunggu sampai muncul:

```
✅ WhatsApp client siap!
```

## Cara Kerja

1. **Booking dibuat** di landing page → Next.js kirim webhook ke backend
2. **Admin update status** di admin panel → Next.js kirim webhook ke backend
3. **Backend terima webhook** → Format pesan → Kirim via WhatsApp
4. **Anda dapat notifikasi** di WhatsApp dengan detail booking

## Webhook Events

Backend menerima webhook dengan event:

- `booking.created` - Booking baru dibuat
- `booking.confirmed` - Booking dikonfirmasi
- `booking.in_progress` - Survey sedang berlangsung
- `booking.completed` - Survey selesai
- `booking.cancelled` - Booking dibatalkan
- `booking.manual_notify` - Notifikasi manual dari admin

## Endpoint

### Health Check

```bash
GET http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "whatsappReady": true,
  "whatsappNumber": "628XXXXXXXXXX"
}
```

### Webhook Receiver

```bash
POST http://localhost:5000/webhook/booking
```

Payload yang diterima dari Next.js:
```json
{
  "event": "booking.created",
  "timestamp": "2026-05-19T10:30:00Z",
  "booking": {
    "id": "booking_123",
    "fullName": "John Doe",
    "targetArea": "Dinoyo",
    "surveyPackage": "Paket Standar",
    "surveyDate": "2026-05-25",
    "status": "pending",
    ...
  }
}
```

## Troubleshooting

### QR Code tidak muncul

- Pastikan terminal mendukung output
- Coba jalankan ulang server

### WhatsApp tidak terkoneksi

- Logout dari semua perangkat WhatsApp lain
- Scan QR code ulang
- Pastikan internet stabil

### Pesan tidak terkirim

- Pastikan nomor WhatsApp benar
- Cek WhatsApp client status: `GET /health`
- Lihat log di terminal untuk error message

## Port Binding

Jika port 5000 sudah terpakai, ubah di `.env`:

```env
PORT=5001
```

Lalu update di Next.js `.env`:

```env
BOOKING_WEBHOOK_URL=http://localhost:5001/webhook/booking
```

## Notes

- Server harus selalu berjalan untuk menerima notifikasi
- WhatsApp session disimpan di folder `.wwebjs_auth/`
- Jangan lakukan logout WhatsApp di hp saat server berjalan
