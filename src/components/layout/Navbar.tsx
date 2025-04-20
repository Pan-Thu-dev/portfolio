'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Helper function to determine the correct link href based on current page
  const getLinkHref = (section: string) => {
    // If we're on the home page, use anchor links to scroll to sections
    if (isHomePage) {
      return `#${section}`;
    }
    // If we're on another page, redirect to home page + anchor
    return `/#${section}`;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full bg-[#0a0a0a]/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-xl font-bold text-transparent">
              Pan Thu
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="/about"
              className="text-gray-400 transition-colors hover:text-gray-100"
            >
              About
            </Link>
            <Link
              href={getLinkHref('projects')}
              className="text-gray-400 transition-colors hover:text-gray-100"
            >
              Projects
            </Link>
            <Link
              href={getLinkHref('contact')}
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-5 py-1.5 text-sm font-medium text-white transition-all hover:opacity-90"
            >
              Let&apos;s Talk
            </Link>
            <Link
              href="/auth/admin"
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#1a2037] px-4 py-1.5 text-sm font-medium text-white transition-all hover:bg-[#232a45]"
            >
              <Lock className="h-3.5 w-3.5" />
              Admin
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="flex items-center justify-center p-2 rounded-md text-gray-400 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col py-4 space-y-4 border-t border-gray-800">
                <Link
                  href="/about"
                  className="px-4 py-2 text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href={getLinkHref('projects')}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  href={getLinkHref('contact')}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/auth/admin"
                  className="mx-4 flex items-center gap-1.5 rounded-md bg-[#1a2037] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#232a45]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Lock className="h-3.5 w-3.5" />
                  Admin Portal
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar; 