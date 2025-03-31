'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Navbar = () => {
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
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link
              href="#about"
              className="text-gray-400 transition-colors hover:text-gray-100"
            >
              About
            </Link>
            <Link
              href="#projects"
              className="text-gray-400 transition-colors hover:text-gray-100"
            >
              Projects
            </Link>
            <Link
              href="#skills"
              className="text-gray-400 transition-colors hover:text-gray-100"
            >
              Skills
            </Link>
            <Link
              href="#contact"
              className="text-gray-400 transition-colors hover:text-gray-100"
            >
              Contact
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-1.5 text-sm font-medium text-white transition-all hover:opacity-90"
            >
              Let&apos;s Talk
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;