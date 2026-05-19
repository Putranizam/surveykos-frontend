import * as admin from 'firebase-admin';

/**
 * 1. Fungsi internal untuk memastikan Firebase Admin terinisialisasi dengan aman.
 * Fungsi ini kebal terhadap eror duplikasi inisialisasi pada environment Serverless/Vercel.
 */
function getFirebaseAdminApp() {
  if (!admin.apps.length) {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (projectId && clientEmail && privateKey) {
        // Jaring pengaman: Jika private key terbungkus tanda kutip ganda di Vercel, kita bersihkan dulu
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
        console.log('✅ Firebase Admin initialized successfully');
      } else {
        console.warn('⚠️ Firebase Admin credentials missing from environment variables.');
      }
    } catch (error) {
      console.error('❌ Firebase Admin initialization error:', error);
    }
  }
  return admin.apps[0];
}

/**
 * 2. Ekspor db menggunakan JavaScript Proxy (Anti-Null & Anti-Undefined).
 * Setiap kali file store memanggil properti/fungsi dari `db` (misal: db.collection, db.doc),
 * Proxy ini akan memastikan Firebase Admin sudah menyala tanpa merusak build-time Next.js.
 */
export const db = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop) {
    const app = getFirebaseAdminApp();
    if (!app) {
      throw new Error(
        "🔥 Database Firestore dipanggil sebelum Environment Variables Firebase dikonfigurasi dengan benar di Vercel."
      );
    }
    
    const firestoreInstance = admin.firestore();
    return Reflect.get(firestoreInstance, prop);
  }
});