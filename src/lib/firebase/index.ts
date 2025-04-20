// Client-side Firebase exports
export * from './firebase';
export * from './auth';
export * from './permissions';
export * from './token';

// Admin-side Firebase exports (server-side only)
export {
  firestore,
  ensureFirestoreSetup,
  getAuthAdmin,
  getAppInstance as getAdminAppInstance,
  verifyIdToken,
  authenticateAdminRequest
} from './admin'; 