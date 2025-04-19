'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn, AlertTriangle, Mail, Lock } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { isAllowedAdmin } from '@/lib/firebase/permissions';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      if (!isAllowedAdmin(user.email || '')) {
        setError('You do not have permission to access the admin panel.');
        return;
      }
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    const { user, error } = await signInWithEmail(email, password);
    
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    if (user) {
      // Check if user email is in allowed admins list
      if (!isAllowedAdmin(user.email || '')) {
        setError('You do not have permission to access the admin panel.');
        setLoading(false);
        return;
      }
      
      // Get authentication token
      const token = await user.getIdToken();
      
      // Set auth cookie
      document.cookie = `auth_token=${token}; path=/; max-age=3600; secure; samesite=strict`;
      
      // Redirect to admin dashboard or callback URL if provided
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get('callbackUrl') || '/admin';
      router.push(callbackUrl);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    const { user, error } = await signInWithGoogle();
    
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    if (user) {
      // Check if user email is in allowed admins list
      if (!isAllowedAdmin(user.email || '')) {
        setError('You do not have permission to access the admin panel.');
        setLoading(false);
        return;
      }
      
      // Get authentication token
      const token = await user.getIdToken();
      
      // Set auth cookie
      document.cookie = `auth_token=${token}; path=/; max-age=3600; secure; samesite=strict`;
      
      // Redirect to admin dashboard or callback URL if provided
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get('callbackUrl') || '/admin';
      router.push(callbackUrl);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Sign in to access your admin dashboard</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6 mt-8">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition disabled:opacity-50"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-md font-medium transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign in with Email
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-650 text-white rounded-md font-medium transition border border-gray-600 disabled:opacity-70"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
} 