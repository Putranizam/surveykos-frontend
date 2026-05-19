import * as admin from 'firebase-admin';

// 1. Fungsi internal inisialisasi aman
function getFirebaseAdminApp() {
  if (!admin.apps.length) {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (projectId && clientEmail && privateKey) {
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

// 2. Ekspor instans db secara dinamis dan aman
getFirebaseAdminApp();
export const db = admin.apps.length ? admin.firestore() : (null as unknown as admin.firestore.Firestore);