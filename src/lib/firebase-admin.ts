import * as admin from 'firebase-admin';

// 1. Fungsi internal untuk memastikan Firebase terinisialisasi dengan aman
function initializeFirebaseAdmin() {
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
        console.log('✅ Firebase Admin initialized successfully');
      } else {
        console.warn('⚠️ Firebase Admin credentials missing from environment variables.');
      }
    } catch (error) {
      console.error('❌ Firebase Admin initialization error:', error);
    }
  }
}

// 2. Jalankan inisialisasi secara instan sebelum melakukan ekspor
initializeFirebaseAdmin();

// 3. Ekspor fungsi database secara aman tanpa perantara kondisi ternary inline
export const db = admin.firestore();