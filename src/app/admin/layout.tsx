'use client';

import { AdminSidebar } from '@/components/admin';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

// !!! IMPORTANT: Add Authentication/Authorization checks here in a real app !!!
// This layout currently does NOT protect the admin routes.

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-gray-300">
        {/* Admin Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="lg:ml-64 transition-all duration-300 min-h-screen">
          <main className="container mx-auto px-6 py-8 max-w-7xl">
            {/* Page Content */}
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
} 