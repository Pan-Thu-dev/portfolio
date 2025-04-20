import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Initialize Firebase app
 */
export const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  // Return the existing app if already initialized
  return getApp();
};

/**
 * Get Firestore instance
 */
export const getFirestoreInstance = () => {
  const app = getFirebaseApp();
  return getFirestore(app);
};

/**
 * Get Storage instance
 */
export const getStorageInstance = () => {
  const app = getFirebaseApp();
  return getStorage(app);
}; 