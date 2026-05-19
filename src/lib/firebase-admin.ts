import * as admin from 'firebase-admin';

// 1. Pastikan inisialisasi hanya berjalan jika belum ada app yang aktif
if (!admin.apps.length) {
  try {
    // Cek apakah Environment Variables krusial sudah terisi
    // (Saat build di Vercel, jika env lupa dimasukkan, ini akan mencegah crash langsung)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin initialized successfully');
    } else {
      console.warn('Firebase Admin credentials missing from environment variables.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

// 2. Gunakan fungsi atau pengecekan dinamis saat mengekspor db
// Agar jika app belum terinisialisasi (saat build rute statis), ia tidak langsung merusak jalannya compile
export const db = admin.apps.length ? admin.firestore() : null as unknown as admin.firestore.Firestore;