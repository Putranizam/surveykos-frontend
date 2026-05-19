# Quick Deploy Guide - Infinity Hosting

## 🚀 Langkah-Langkah Cepat

### Step 1: Setup Lokal (Hanya Pertama Kali)

#### A. Setup Backend
```bash
cd backend

# Setup git lokal
git init
git config user.email "your@email.com"
git config user.name "Your Name"

# Copy environment variables
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Install dependencies
npm install

# Test locally
npm start
```

#### B. Setup Frontend
```bash
cd ..

# Copy environment variables
cp .env.example .env.local
# Edit .env.local dengan konfigurasi Anda

# Install dependencies
npm install

# Test locally
npm run dev
```

---

### Step 2: Connect ke Infinity Git Repository

#### Untuk Backend:
```bash
cd backend

# Add remote Infinity
git remote add infinity https://git.infinity.web.id/USERNAME/survey-kos-backend.git

# Push pertama kali
git add .
git commit -m "Initial backend setup"
git push -u infinity main
```

#### Untuk Frontend:
```bash
cd ..

# Add remote Infinity
git remote add infinity https://git.infinity.web.id/USERNAME/survey-kos-frontend.git

# Push pertama kali
git add .
git commit -m "Initial frontend setup"
git push -u infinity main
```

---

### Step 3: Konfigurasi di Infinity Dashboard

#### Backend:
1. Login ke https://infinity.web.id
2. Pilih aplikasi `survey-kos-backend`
3. **Settings** → **Environment Variables** → Tambahkan:
   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://survey-kos-frontend.infinityfreeapp.com
   WHATSAPP_NUMBER=628XXXXXXXXXX
   ```

#### Frontend:
1. Pilih aplikasi `survey-kos-frontend`
2. **Settings** → **Environment Variables** → Tambahkan:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://survey-kos-backend.infinityfreeapp.com
   ```

---

### Step 4: Deploy (Update Kode)

Setelah setup awal, untuk setiap update:

#### Backend:
```bash
cd backend
git add .
git commit -m "Update: [deskripsi perubahan]"
git push infinity main
# Tunggu ~2-3 menit untuk auto-deploy
```

#### Frontend:
```bash
cd ..
git add .
git commit -m "Update: [deskripsi perubahan]"
git push infinity main
# Tunggu ~2-3 menit untuk auto-deploy
```

---

### Step 5: Monitoring

1. Buka dashboard Infinity
2. Pilih aplikasi
3. Klik **Logs** untuk melihat output deployment
4. Tunggu sampai status menjadi **Active/Running**

---

## 🔍 Troubleshooting Cepat

| Masalah | Solusi |
|---------|--------|
| Build error | Cek logs di Infinity dashboard |
| 502 Bad Gateway | Restart aplikasi di dashboard |
| CORS error | Cek FRONTEND_URL di backend env |
| Firebase error | Verifikasi env variables sesuai |
| Port conflict | Pastikan PORT=3001 di .env backend |

---

## ✅ Verification Checklist

Sebelum declare sukses:

```bash
# Test Backend
curl https://survey-kos-backend.infinityfreeapp.com/health

# Test Frontend - akses di browser
https://survey-kos-frontend.infinityfreeapp.com

# Test API Call dari Frontend
# Buka console browser dan cek apakah API calls berhasil
```

---

## 📞 Bantuan

Jika ada masalah:
1. Check logs di Infinity dashboard
2. Verifikasi environment variables
3. Pastikan git push berhasil (tidak ada error)
4. Tunggu deployment selesai (bisa sampai 5 menit)

Happy deploying! 🎉
