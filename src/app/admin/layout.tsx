import { AdminSidebar } from '@/components/admin';
import { AlertTriangle } from 'lucide-react';

// !!! IMPORTANT: Add Authentication/Authorization checks here in a real app !!!
// This layout currently does NOT protect the admin routes.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300">
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="lg:ml-64 transition-all duration-300 min-h-screen">
        <main className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Security Warning Banner */}
          <div className="mb-8 bg-yellow-900/30 border border-yellow-700 text-yellow-500 p-4 rounded flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Admin area not secured</p>
              <p className="text-sm">This admin interface is currently not protected by authentication. Anyone with the URL can access it. Implement proper authentication before deploying to production.</p>
            </div>
          </div>
          
          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
} 