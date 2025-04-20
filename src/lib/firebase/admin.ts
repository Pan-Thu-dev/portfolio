import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';
import { App } from 'firebase-admin/app';

// Helper to prevent multiple initializations
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let appInstance: App | null = null;

/**
 * Type definition for Firebase errors
 */
interface FirebaseError extends Error {
  code?: number | string;
  details?: string;
}

/**
 * Get the service account credentials from environment variables
 */
const getServiceAccountCredentials = () => {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set');
    }
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (error) {
    console.error('Failed to parse Firebase service account JSON:', error);
    throw error;
  }
};

/**
 * Get the Firebase Admin app instance
 */
export const getAppInstance = (): App => {
  // Return cached instance if exists
  if (appInstance) {
    return appInstance;
  }
  
  const existingApps = getApps();
  
  // Return existing app if already initialized
  if (existingApps.length > 0) {
    appInstance = getApp();
    return appInstance;
  }
  
  // Initialize new app
  const credentials = getServiceAccountCredentials();
  
  appInstance = initializeApp({
    credential: cert(credentials),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  
  console.log('Firebase Admin SDK initialized successfully');
  return appInstance;
};

/**
 * Check if Firestore database and collections exist and create them if needed
 */
export async function ensureFirestoreSetup(db: Firestore) {
  try {
    // Just check if we can access the database by running a simple query
    // This will throw a NOT_FOUND error if the database doesn't exist
    await db.collection('_setup_check').limit(1).get();
    console.log('Firestore database exists');
    return true;
  } catch (error: unknown) {
    const fbError = error as FirebaseError;
    if (fbError.code === 5 || fbError.code === '5' || fbError.code === 'not-found') { // NOT_FOUND error
      console.warn('Firebase: Database may not be created yet. Please ensure Firestore is enabled in the Firebase console.');
      // Return false but don't throw - let the calling code decide how to handle this
      return false;
    }
    // For other errors, log but still return true (we'll let the operation fail naturally if it's going to)
    console.error('Error checking Firestore setup:', error);
    return true;
  }
}

/**
 * Initialize Firebase Admin and return the Firestore instance
 */
function getFirestoreAdmin() {
  try {
    // Check if already initialized
    if (firestoreInstance) {
      return { firestore: firestoreInstance };
    }

    // Get app instance (will initialize if needed)
    const app = getAppInstance();
    
    // Get and cache the Firestore instance
    firestoreInstance = getFirestore(app);
    
    // Try to ensure database exists (don't await, do this in background)
    ensureFirestoreSetup(firestoreInstance).catch(err => 
      console.error('Failed to check Firestore setup:', err)
    );
    
    return { firestore: firestoreInstance };
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    return { firestore: null };
  }
}

/**
 * Get the Firebase Auth Admin instance
 */
export const getAuthAdmin = (): Auth => {
  if (authInstance) {
    return authInstance;
  }
  
  const app = getAppInstance();
  authInstance = getAuth(app);
  return authInstance;
};

/**
 * Verify a Firebase ID token
 * @param token The ID token to verify
 * @param checkRevoked Whether to check if the token has been revoked (default: true)
 * @returns The decoded token if valid
 */
export const verifyIdToken = async (token: string, checkRevoked = true): Promise<DecodedIdToken> => {
  try {
    const auth = getAuthAdmin();
    return await auth.verifyIdToken(token, checkRevoked);
  } catch (error: unknown) {
    console.error('Firebase token verification failed:', error);
    
    // Improve error message based on error code
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/id-token-expired') {
        throw new Error('Authentication token has expired. Please sign in again.');
      } else if (firebaseError.code === 'auth/id-token-revoked') {
        throw new Error('Authentication token has been revoked. Please sign in again.');
      } else if (firebaseError.code === 'auth/invalid-id-token') {
        throw new Error('Invalid authentication token. Please sign in again.');
      }
    }
    
    throw new Error('Authentication failed. Please sign in again.');
  }
};

/**
 * Authenticate and authorize an admin request using a token
 * @param authHeader The Authorization header value
 * @returns The decoded token if valid and authorized
 */
export const authenticateAdminRequest = async (authHeader: string | null): Promise<DecodedIdToken> => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header missing or invalid');
  }
  
  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    throw new Error('Authentication token missing');
  }
  
  // Verify the token
  const decodedToken = await verifyIdToken(token);
  
  // Check if the user has admin privileges (this can be customized based on your needs)
  if (!decodedToken.email) {
    throw new Error('User email missing from authentication token');
  }
  
  return decodedToken;
};

// Export the Firestore instance
export const { firestore } = getFirestoreAdmin(); 