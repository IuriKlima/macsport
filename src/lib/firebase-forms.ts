import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const FORMS_APP_NAME = 'forms-app';

let app;

const projectId = process.env.FORMS_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FORMS_FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FORMS_FIREBASE_PRIVATE_KEY;

if (!getApps().find(a => a.name === FORMS_APP_NAME)) {
  if (projectId && clientEmail && privateKey) {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    }, FORMS_APP_NAME);
  }
} else {
  app = getApp(FORMS_APP_NAME);
}

export const formsDb = app ? getFirestore(app) : null;
export const formsStorage = app ? getStorage(app) : null;
