import * as admin from 'firebase-admin';

/**
 * 1. Fungsi internal untuk memastikan Firebase Admin terinisialisasi hanya saat dibutuhkan (Lazy Init).
 * Menghindari crash 'app/no-app' saat proses compiling/build di Vercel.
 */
function ensureFirebaseAdmin(): void {
  if (!admin.apps.length) {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (projectId && clientEmail && privateKey) {
        // Jaring pengaman: Bersihkan tanda kutip jika terbawa dari dashboard Vercel
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

/**
 * 2. Ekspor db sebagai Proxy Pintar (Anti-Crash & Aman Konteks Fungsi).
 * Memastikan metode seperti db.collection() mempertahankan konteks internal Firestore-nya.
 */
export const db = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop) {
    // Jalankan inisialisasi HANYA KETIKA file lain mulai mengakses properti db
    ensureFirebaseAdmin();
    
    if (!admin.apps.length) {
      throw new Error("🔥 Firebase App belum diinisialisasi. Pastikan Environment Variables (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY) sudah diisi dan di-Redeploy di Vercel.");
    }
    
    const firestoreInstance = admin.firestore();
    const value = Reflect.get(firestoreInstance, prop);
    
    // PERBAIKAN UTAMA: Jika properti yang diakses adalah sebuah fungsi/metode (seperti .collection()),
    // kita wajib mengikat (bind) fungsi tersebut ke instans firestore asli agar tidak kehilangan konteks 'this'.
    if (typeof value === 'function') {
      return value.bind(firestoreInstance);
    }
    
    return value;
  }
});