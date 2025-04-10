import Navbar from '@/components/layout/Navbar'; // Or a dedicated AdminNavbar
import Link from 'next/link';

// !!! IMPORTANT: Add Authentication/Authorization checks here in a real app !!!
// This layout currently does NOT protect the admin routes.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300">
      {/* You might want a simpler Navbar for admin */}
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <nav className="flex gap-4 text-fuchsia-400">
                <Link href="/admin/projects" className="hover:underline">Manage Projects</Link>
                {/* Add other admin links here */}
            </nav>
             <p className="mt-4 text-yellow-500 text-sm">⚠️ Warning: Admin area currently not secured.</p>
        </div>
        {children}
      </main>
    </div>
  );
} 