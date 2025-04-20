'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get any callback URL from the query parameters
    const callbackUrl = searchParams.get('callbackUrl');
    
    // Construct new URL with callback parameter if it exists
    const targetUrl = callbackUrl 
      ? `/auth/admin?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : '/auth/admin';
    
    // Redirect to the new login page
    router.replace(targetUrl);
  }, [router, searchParams]);
  
  // Show a loading spinner while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-[#bd34fe]" />
    </div>
  );
}

export default function OldLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#bd34fe]" />
      </div>
    }>
      <LoginRedirect />
    </Suspense>
  );
} 