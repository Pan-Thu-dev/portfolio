'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronLeft, 
  LayoutDashboard, 
  FolderKanban, 
  BarChart3, 
  Cpu, 
  LogOut, 
  Menu,
  X,
  Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

// Define sidebar navigation items
const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Skills', href: '/admin/skills', icon: BarChart3 },
  { name: 'Technologies', href: '/admin/technologies', icon: Cpu },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const sidebarWidth = collapsed ? 'w-20' : 'w-64';
  
  // Sidebar content - reused in both desktop and mobile versions
  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {(!collapsed || mobile) && (
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">Admin Portal</h1>
          </div>
        )}
        {mobile ? (
          <button 
            onClick={toggleMobile} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button 
            onClick={toggleSidebar} 
            className={`text-gray-400 hover:text-white transition-colors ${collapsed ? 'mx-auto' : ''}`}
          >
            <ChevronLeft className={`h-5 w-5 ${collapsed ? 'rotate-180' : ''} transition-transform`} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="py-4 flex flex-col flex-grow">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {(!collapsed || mobile) && "Main Navigation"}
        </div>
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`
              flex items-center py-3 px-4 my-1 ${mobile ? '' : 'mx-2'} rounded-lg transition-colors
              ${isActive(item.href) 
                ? 'bg-[#bd34fe]/20 text-[#bd34fe]' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }
            `}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {(!collapsed || mobile) && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-800">
        <Link 
          href="/"
          className="flex items-center py-3 px-4 my-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          {(!collapsed || mobile) && <span className="ml-3">Back to Website</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center py-3 px-4 my-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {(!collapsed || mobile) && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={toggleMobile}
          className="bg-[#1a2037] text-gray-300 p-2 rounded-md hover:bg-[#232a45] hover:text-white transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar (overlay) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50" 
              onClick={toggleMobile}
            />
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 h-full w-[280px] bg-[#0f1629] shadow-lg z-30 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent mobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div 
        className={`hidden lg:flex h-screen flex-col fixed bg-[#0f1629] border-r border-gray-800 ${sidebarWidth} transition-all duration-300 ease-in-out z-10`}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar; 