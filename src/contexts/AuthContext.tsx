'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { getAuthInstance } from '@/lib/firebase/auth';
import { setAuthCookie, setupTokenRefresh } from '@/lib/firebase/token';

// Define the Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the Auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Custom hook to access the Auth context
export const useAuth = () => useContext(AuthContext);

// Auth context provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    // Set up the auth state change listener
    const auth = getAuthInstance();
    
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      console.log('Auth state changed:', authUser?.email || 'No user');
      
      // Clean up previous token refresh if exists
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      
      if (authUser) {
        // User is signed in
        setUser(authUser);
        
        // Get and set fresh token in cookie
        try {
          const token = await authUser.getIdToken(true); // Force refresh token
          setAuthCookie(token);
          
          // Set up token refresh - will keep token fresh
          const cleanup = setupTokenRefresh(authUser);
          cleanupRef.current = cleanup;
        } catch (error) {
          console.error('Error setting up authentication:', error);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      
      setLoading(false);
    });
    
    // Clean up the auth state listener and token refresh on unmount
    return () => {
      unsubscribe();
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);
  
  // Provide the auth context values to child components
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 