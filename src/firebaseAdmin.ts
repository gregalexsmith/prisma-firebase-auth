import * as admin from 'firebase-admin';

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_DATABASE_URL,
  FIREBASE_PRIVATE_KEY
} = process.env

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY
  }),
  databaseURL: FIREBASE_DATABASE_URL
});

export default app;