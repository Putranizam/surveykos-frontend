# Panduan Deployment ke Infinity Hosting - FREE TIER

## ⚠️ PENTING: Informasi Infinity Free

Panduan ini khusus untuk **Infinity Hosting FREE TIER** (Gratis)

### Keuntungan Free Tier:
- ✅ Gratis selamanya (selama aktif)
- ✅ Domain gratis (*.infinityfreeapp.com)
- ✅ 5 GB storage
- ✅ Support Node.js & static sites

### Limitasi Free Tier:
- ⏱️ Uptime: ~99% (tidak 100%)
- 💾 Database space terbatas
- 📊 Bandwidth terbatas
- 🛌 Sleep mode jika tidak ada traffic 24 jam (restart otomatis saat ada request)
- ⏸️ Tidak ada email support (hanya forum)

### Rekomendasi untuk Free Tier:
- Gunakan untuk **development/staging** atau **small projects**
- Monitor logs secara berkala
- Backup data penting secara manual
- Jangan host aplikasi yang memerlukan uptime 99.9%

---

## 📋 Daftar Persiapan

### Apa yang Anda Butuhkan:
- [x] Akun Infinity Hosting (free)
- [x] Domain Infinity gratis (*.infinityfreeapp.com)
- [ ] Git installed di local Anda
- [ ] Node.js terinstall

---

## 🚀 Langkah 1: Persiapkan Backend

### 1.1 Login ke Infinity Hosting
- Buka https://infinity.web.id/
- Login dengan akun Anda

### 1.2 Buat Aplikasi Node.js
1. Di dashboard, klik **"Buat Aplikasi"**
2. Pilih **Node.js**
3. Beri nama: `survey-kos-backend`
4. Pilih versi Node.js: **18+** atau **20+**
5. Klik **Buat**

### 1.3 Setup Backend Deployment
Setelah aplikasi dibuat, Anda akan mendapat:
- **URL Git Repository** (misal: `https://git.infinity.web.id/username/survey-kos-backend.git`)
- **SSH Key** (jika menggunakan SSH)

#### Clone dari Git Infinity:
```bash
cd c:\xampp\htdocs\survey-kos
git clone https://git.infinity.web.id/username/survey-kos-backend.git temp-backend
```

#### Setup folder backend:
```bash
# Copy file backend ke git repository
cp -r backend/* temp-backend/

# Masuk ke folder
cd temp-backend

# Tambahkan dan commit
git add .
git commit -m "Initial backend setup"
git push origin main
```

### 1.4 Konfigurasi Environment Variables
Di Infinity dashboard untuk aplikasi backend:
1. Klik **Settings** → **Environment Variables**
2. Tambahkan variable berikut:

```
NODE_ENV=production
PORT=3001
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

Dapatkan nilai ini dari Firebase Console → Project Settings → Service Account.

---

## 🌐 Langkah 2: Deploy Frontend (Next.js)

### 2.1 Buat Aplikasi Static/Next.js
1. Di dashboard Infinity, klik **"Buat Aplikasi"**
2. Pilih **Next.js** (jika ada) atau **Static Site**
3. Beri nama: `survey-kos-frontend`
4. Klik **Buat**

### 2.2 Setup Frontend Deployment
```bash
# Clone git repository frontend dari Infinity
cd c:\xampp\htdocs\survey-kos
git clone https://git.infinity.web.id/username/survey-kos-frontend.git temp-frontend

# Copy file frontend
cp -r app/* temp-frontend/app/
cp -r components/* temp-frontend/components/
cp -r public/* temp-frontend/public/
cp -r src/* temp-frontend/src/
cp package.json temp-frontend/
cp package-lock.json temp-frontend/ 2>/dev/null || true
cp tsconfig.json temp-frontend/
cp tailwind.config.ts temp-frontend/ 2>/dev/null || true
cp postcss.config.mjs temp-frontend/
cp next.config.ts temp-frontend/
cp eslint.config.mjs temp-frontend/

# Masuk ke folder
cd temp-frontend

# Setup git
git add .
git commit -m "Initial frontend setup"
git push origin main
```

### 2.3 Konfigurasi Next.js untuk Production
Update file `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Penting untuk Infinity Hosting
};

export default nextConfig;
```

### 2.4 Konfigurasi Environment Variables Frontend
Di Infinity dashboard untuk aplikasi frontend:
1. Klik **Settings** → **Environment Variables**
2. Tambahkan:

```
NEXT_PUBLIC_BACKEND_URL=https://survey-kos-backend.infinityfreeapp.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

---

## ⚙️ Langkah 3: Konfigurasi Produksi

### 3.1 Update URL Backend di Frontend
File: `app/layout.tsx` atau file API lainnya

Ganti semua referensi localhost dengan:
```typescript
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://survey-kos-backend.infinityfreeapp.com';
```

### 3.2 Update CORS di Backend
File: `backend/server.js`

```javascript
const cors = require('cors');
const app = require('express')();

app.use(cors({
  origin: ['https://survey-kos-frontend.infinityfreeapp.com', 'https://yourdomain.com'],
  credentials: true
}));
```

### 3.3 Pastikan Port di Backend
File: `backend/server.js`

```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 🔄 Langkah 4: Deploy & Monitor

### ⏰ Catatan Free Tier
- Deployment pertama bisa memakan waktu 5-10 menit
- Jika aplikasi tidak diakses 24 jam, akan masuk mode sleep
- Restart otomatis saat ada request (tunggu ~10-20 detik)

### 4.1 Trigger Deployment
Setiap kali Anda `git push`, Infinity Hosting secara otomatis:
1. Pull code dari git repository
2. Install dependencies
3. Build aplikasi
4. Restart service

### 4.2 Monitor Logs
Di Infinity dashboard:
1. Pilih aplikasi
2. Klik **Logs** atau **Terminal**
3. Lihat output deployment

### 4.3 Test Aplikasi
Setelah deployment selesai:
- Akses frontend: `https://survey-kos-frontend.infinityfreeapp.com`
- Test API backend: `https://survey-kos-backend.infinityfreeapp.com/api/bookings`

---

## 🐛 Troubleshooting

### Masalah: Aplikasi Sleep/Offline
**Penjelasan:** Free tier akan sleep jika tidak ada traffic 24 jam  
**Solusi:**
- Aplikasi akan auto-restart saat ada request (wait 10-20 detik)
- Gunakan uptime monitoring service untuk keep-alive
- Bisa upgrade ke paid plan jika perlu uptime 24/7

### Masalah: Build Error
**Solusi:**
- Pastikan `npm install` berjalan di Infinity
- Check Node version compatibility
- Lihat logs di Infinity dashboard

### Masalah: 502 Bad Gateway
**Solusi:**
- Pastikan backend PORT sudah dikonfigurasi di `.env`
- Restart aplikasi dari dashboard
- Tunggu jika aplikasi sedang "wake up" dari sleep mode
- Check RAM/resource usage

### Masalah: CORS Error
**Solusi:**
- Update `allowedOrigins` di `next.config.ts`
- Pastikan CORS middleware di backend sudah benar
- Tambahkan domain Infinity ke whitelist

### Masalah: Firebase Error
**Solusi:**
- Pastikan environment variables sudah benar
- Check Firebase project permissions
- Pastikan service account memiliki akses yang tepat

---

## 📝 File yang Perlu Dimodifikasi

```
survey-kos/
├── backend/
│   ├── server.js (update CORS & PORT)
│   └── package.json ✓
├── app/
│   ├── layout.tsx (update API_URL)
│   ├── page.tsx (update API_URL)
│   └── api/ (update endpoints)
├── next.config.ts (update untuk production)
├── package.json ✓
└── .env.local (jangan commit, hanya lokal)
```

---

## 🎯 Checklist Akhir

Sebelum deploy final:

- [ ] Environment variables sudah dikonfigurasi di Infinity
- [ ] CORS sudah diupdate
- [ ] Firebase config sudah benar
- [ ] next.config.ts sudah diupdate
- [ ] backend/server.js sudah siap production
- [ ] Git repository sudah terhubung dengan Infinity
- [ ] Sudah test API calls dari frontend ke backend
- [ ] Domain sudah pointing ke Infinity (jika punya domain custom)

---

## 📚 Resources Tambahan

- Infinity Hosting Docs: https://docs.infinityfreeapp.com/
- Next.js Production: https://nextjs.org/docs/deployment
- Express.js Best Practices: https://expressjs.com/en/advanced/best-practice-performance.html

---

**Selamat! Aplikasi Anda siap di-deploy ke Infinity Hosting! 🚀**
