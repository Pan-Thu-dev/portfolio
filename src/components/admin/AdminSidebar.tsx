'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  const sidebarWidth = collapsed ? 'w-20' : 'w-64';
  
  // Sidebar content - reused in both desktop and mobile versions
  const SidebarContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Admin Portal</h1>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className={`text-gray-400 hover:text-white transition-colors ${collapsed ? 'mx-auto' : ''}`}
        >
          <ChevronLeft className={`h-5 w-5 ${collapsed ? 'rotate-180' : ''} transition-transform`} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="py-4 flex flex-col flex-grow">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {!collapsed && "Main Navigation"}
        </div>
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`
              flex items-center py-3 px-4 my-1 mx-2 rounded-lg transition-colors
              ${isActive(item.href) 
                ? 'bg-fuchsia-900/30 text-fuchsia-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }
            `}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-800">
        <Link 
          href="/"
          className="flex items-center py-3 px-4 my-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Exit Admin</span>}
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={toggleMobile}
          className="bg-gray-900 text-gray-300 p-2 rounded-lg hover:text-white transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar (overlay) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50" onClick={toggleMobile}>
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div 
        className={`hidden lg:flex h-screen flex-col fixed bg-gray-900 border-r border-gray-800 ${sidebarWidth} transition-all duration-300 ease-in-out z-10`}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar; 