# Pre-Deployment Checklist - Infinity Hosting

## ✓ Backend Checklist

### Code Quality
- [ ] Tidak ada console.error yang tidak tertangani
- [ ] Semua dependencies di-install (`npm install` berhasil)
- [ ] `npm start` berjalan tanpa error di lokal
- [ ] Port bisa di-customize via environment variable

### Configuration
- [ ] File `.env` sudah di-create dari `.env.example`
- [ ] `PORT` diatur ke `3001` (default Infinity)
- [ ] `FRONTEND_URL` sudah di-set dengan benar
- [ ] `WHATSAPP_NUMBER` sudah dikonfigurasi (jika ada)
- [ ] CORS sudah updated untuk origin yang benar

### Logs & Monitoring
- [ ] Folder `logs/` ada dan bisa di-write
- [ ] Health check endpoint (`/health`) berfungsi
- [ ] Error handling sudah proper

### Git Setup
- [ ] `git init` sudah di-jalankan
- [ ] `remote infinity` sudah di-add
- [ ] Bisa `git push infinity main` tanpa error

---

## ✓ Frontend Checklist

### Code Quality
- [ ] `npm install` berhasil
- [ ] `npm run build` berhasil (test build production)
- [ ] `npm run dev` berjalan tanpa error
- [ ] Tidak ada unused imports atau variables

### Configuration
- [ ] File `.env.local` sudah di-create dari `.env.example`
- [ ] `NEXT_PUBLIC_BACKEND_URL` sudah di-set
- [ ] Firebase environment variables sudah lengkap
- [ ] `next.config.ts` sudah di-update dengan `output: "standalone"`

### API Calls
- [ ] Semua API calls menggunakan `NEXT_PUBLIC_BACKEND_URL`
- [ ] Tidak ada hardcoded localhost URLs
- [ ] Error handling untuk API calls sudah ada

### Build Optimization
- [ ] Tidak ada large unoptimized images
- [ ] CSS sudah dioptimalkan (Tailwind working)
- [ ] JavaScript bundle size reasonable

### Git Setup
- [ ] `git init` sudah di-jalankan
- [ ] `remote infinity` sudah di-add
- [ ] Bisa `git push infinity main` tanpa error
- [ ] `.env.local` TIDAK di-commit (di `.gitignore`)

---

## ✓ Infinity Hosting Setup

### Backend Application
- [ ] Aplikasi `survey-kos-backend` sudah dibuat
- [ ] Runtime: **Node.js 18+** atau **20+**
- [ ] Environment variables sudah di-set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3001`
  - [ ] `FRONTEND_URL=https://survey-kos-frontend.infinityfreeapp.com`
  - [ ] Lainnya sesuai `.env.example`
- [ ] Git repository sudah terhubung
- [ ] Build script: `npm install && npm start`

### Frontend Application
- [ ] Aplikasi `survey-kos-frontend` sudah dibuat
- [ ] Runtime: **Node.js 18+** (untuk Next.js)
- [ ] Environment variables sudah di-set:
  - [ ] `NEXT_PUBLIC_BACKEND_URL=...`
  - [ ] Firebase variables
  - [ ] Lainnya sesuai `.env.example`
- [ ] Git repository sudah terhubung
- [ ] Build script: `npm install && npm run build && npm start`

---

## 🚀 Pre-Deployment Testing

### Local Testing
```bash
# Terminal 1 - Backend
cd backend
npm start
# Cek: http://localhost:3001/health

# Terminal 2 - Frontend  
npm run dev
# Cek: http://localhost:3000
```

### API Integration Test
- [ ] Cek network tab saat akses halaman
- [ ] Verifikasi API calls mengarah ke `http://localhost:3001`
- [ ] Response dari API sesuai expected

### Build Test
```bash
# Frontend build test
npm run build
npm run start

# Cek setiap halaman berfungsi normal
```

---

## 📋 Deployment Steps

### Step 1: Final Commit
```bash
# Backend
cd backend
git add .
git commit -m "Deploy: Production ready"
git push infinity main

# Frontend
cd ..
git add .
git commit -m "Deploy: Production ready"
git push infinity main
```

### Step 2: Monitor Deployment
- [ ] Buka Infinity Dashboard
- [ ] Cek logs untuk backend (tunggu ~2-3 menit)
- [ ] Cek logs untuk frontend (tunggu ~2-3 menit)
- [ ] Status kedua aplikasi **Active/Running**

### Step 3: Verify Live
```bash
# Test backend health
curl https://survey-kos-backend.infinityfreeapp.com/health

# Test frontend
https://survey-kos-frontend.infinityfreeapp.com

# Test API integration di browser console
# Pastikan tidak ada CORS error
```

---

## 🐛 Common Issues & Fixes

| Issue | Check | Fix |
|-------|-------|-----|
| Build fails | Logs di Infinity | Review npm errors |
| 502 Bad Gateway | Port config | Set PORT=3001 |
| CORS error | Backend CORS | Update FRONTEND_URL |
| Firebase errors | Env vars | Verify all Firebase vars |
| Blank frontend | Build output | Check build script |
| Slow response | Infinity resources | Check uptime status |

---

## 📝 Post-Deployment

### Monitor First 24 Hours
- [ ] Check error logs regularly
- [ ] Verify all features working
- [ ] Test notification system
- [ ] Monitor performance

### Keep Updated
- [ ] Monitor Infinity maintenance announcements
- [ ] Keep dependencies updated
- [ ] Backup important data regularly

---

**Status: Ready for Deployment ✓**

Jika semua checklist sudah di-tick, aplikasi siap di-deploy ke Infinity Hosting!
