'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn, AlertTriangle, Mail, Lock, ArrowLeft } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { isAllowedAdmin } from '@/lib/firebase/permissions';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      console.log('User already logged in on login page:', user.email);
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
      console.log('Successfully logged in with email:', user.email);
      // Check if user email is in allowed admins list
      if (!isAllowedAdmin(user.email || '')) {
        setError('You do not have permission to access the admin panel.');
        setLoading(false);
        return;
      }
      
      // Get authentication token
      const token = await user.getIdToken(true);
      
      // Set auth cookie with 2hr expiry (longer than default)
      document.cookie = `auth_token=${token}; path=/; max-age=${2*3600}; secure; samesite=strict`;
      
      // Redirect to admin dashboard
      router.push('/admin');
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
      console.log('Successfully logged in with Google:', user.email);
      // Check if user email is in allowed admins list
      if (!isAllowedAdmin(user.email || '')) {
        setError('You do not have permission to access the admin panel.');
        setLoading(false);
        return;
      }
      
      // Get authentication token
      const token = await user.getIdToken(true);
      
      // Set auth cookie with 2hr expiry (longer than default)
      document.cookie = `auth_token=${token}; path=/; max-age=${2*3600}; secure; samesite=strict`;
      
      // Redirect to admin dashboard
      router.push('/admin');
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#bd34fe]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f1629]">
      {/* Login Content */}
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to website
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">Sign in to access your dashboard</p>
          </div>
          
          {error && (
            <div className="p-4 mb-6 bg-red-500/10 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
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
                  className="w-full pl-10 px-4 py-3 rounded-md bg-[#1a2037] border border-[#2a3553] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#bd34fe] focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
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
                  className="w-full pl-10 px-4 py-3 rounded-md bg-[#1a2037] border border-[#2a3553] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#bd34fe] focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-[#bd34fe] hover:bg-[#a429de] text-white rounded-md font-medium transition-all disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign in with Email
                </>
              )}
            </button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a3553]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0f1629] text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-md font-medium transition-all disabled:opacity-70"
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
      
      {/* Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#151d36] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#bd34fe]/20 to-[#2b4aff]/20 opacity-40" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12">
          <div className="w-24 h-24 rounded-full bg-[#bd34fe]/30 flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-[#bd34fe]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Admin Dashboard</h2>
          <p className="text-gray-300 text-center mb-8 max-w-md">
            Manage your portfolio content, projects, skills, and contact submissions securely from this administration portal.
          </p>
          
          <div className="relative w-48 h-48 mb-6">
            {/* Logo - PT initials with gradient styling */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#bd34fe] to-[#2b4aff] rounded-full opacity-20 animate-pulse" />
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="text-6xl font-bold bg-gradient-to-r from-[#bd34fe] to-[#2b4aff] bg-clip-text text-transparent">
                PT
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 mt-4 text-center">
            © {new Date().getFullYear()} Pan Thu. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
} 