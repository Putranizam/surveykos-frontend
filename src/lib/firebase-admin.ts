import * as admin from 'firebase-admin';

// 1. Fungsi internal untuk memastikan Firebase terinisialisasi hanya saat dibutuhkan (Lazy Init)
function ensureFirebaseAdmin(): void {
  if (!admin.apps.length) {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (projectId && clientEmail && privateKey) {
        // Bersihkan tanda kutip jika terbawa dari dashboard Vercel
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
          privateKey = privateKey.slice(1, -1);
        }

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
        console.log('✅ Firebase Admin initialized successfully via Lazy Load');
      } else {
        console.warn('⚠️ Firebase Admin credentials missing from environment variables (Build-time skip).');
      }
    } catch (error) {
      console.error('❌ Firebase Admin initialization error:', error);
    }
  }
}

// 2. Ekspor db sebagai Proxy Pintar
// Menghindari evaluasi instan saat build/compile time, aman 100% dari eror 'app/no-app'
export const db = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop) {
    // Jalankan inisialisasi HANYA KETIKA file lain memanggil properti db (seperti db.collection)
    ensureFirebaseAdmin();
    
    // Jika app gagal dibuat karena env kosong saat build, berikan fallback error yang informatif saat runtime
    if (!admin.apps.length) {
      throw new Error("🔥 Firebase App belum diinisialisasi. Periksa Environment Variables di Vercel.");
    }
    
    const firestoreInstance = admin.firestore();
    return Reflect.get(firestoreInstance, prop);
  }
});