'use client';

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User 
} from 'firebase/auth';
import { getFirebaseApp } from './firebase';

// Firebase error interface
interface FirebaseAuthError extends Error {
  code?: string;
}

// Initialize Firebase Auth
const app = getFirebaseApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    console.error('Email sign in error:', error);
    let errorMessage = 'Failed to sign in';
    
    // Provide more specific error messages
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as FirebaseAuthError;
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (authError.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
    }
    
    return { user: null, error: errorMessage };
  }
};

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    console.error('Google sign in error:', error);
    
    let errorMessage = 'Failed to sign in with Google';
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as FirebaseAuthError;
      if (authError.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled';
      }
    }
    
    return { user: null, error: errorMessage };
  }
};

/**
 * Register a new user with email and password
 */
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Failed to register';
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as FirebaseAuthError;
      if (authError.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (authError.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
    }
    
    return { user: null, error: errorMessage };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    // Clear auth cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
    
    // Sign out from Firebase Auth
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: 'Failed to sign out' };
  }
};

/**
 * Custom hook to get the current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Get the auth instance
 */
export const getAuthInstance = () => auth; 