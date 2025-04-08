import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Helper to prevent multiple initializations
let firestoreInstance: Firestore | null = null;

/**
 * Check if Firestore database and collections exist and create them if needed
 */
async function ensureFirestoreSetup(db: Firestore) {
  try {
    // Just check if we can access the database by running a simple query
    // This will throw a NOT_FOUND error if the database doesn't exist
    await db.collection('_setup_check').limit(1).get();
    console.log('Firestore database exists');
    return true;
  } catch (error: any) {
    if (error.code === 5) { // NOT_FOUND error
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
function getFirebaseAdmin() {
  try {
    // Check if already initialized
    if (firestoreInstance) {
      return { firestore: firestoreInstance };
    }

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      console.error('Firebase service account JSON is missing from environment variables');
      return { firestore: null };
    }
    
    // Parse service account from environment variable
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    // Initialize only if not already initialized
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
    
    // Get and cache the Firestore instance
    firestoreInstance = getFirestore();
    
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

// Export the Firestore instance
export const { firestore } = getFirebaseAdmin();

// Also export the ensureFirestoreSetup utility for components that need to check setup
export { ensureFirestoreSetup }; 