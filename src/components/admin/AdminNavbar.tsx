'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const AdminNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Skills', href: '/admin/skills' },
    { name: 'Technologies', href: '/admin/technologies' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 py-3 px-4 sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo/Title */}
          <Link href="/admin" className="text-xl font-bold text-white">
            Admin Portal
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`transition-colors hover:text-fuchsia-400 ${
                  isActive(item.href) ? 'text-fuchsia-500' : 'text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Exit Admin Button */}
          <Link 
            href="/"
            className="hidden md:flex items-center text-gray-300 hover:text-fuchsia-400 transition-colors"
          >
            <span className="mr-2">Exit Admin</span> 
            <LogOut size={18} />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`block transition-colors hover:text-fuchsia-400 ${
                  isActive(item.href) ? 'text-fuchsia-500' : 'text-gray-300'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              href="/"
              className="flex items-center text-gray-300 hover:text-fuchsia-400 transition-colors pt-2 border-t border-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mr-2">Exit Admin</span> 
              <LogOut size={18} />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar; 