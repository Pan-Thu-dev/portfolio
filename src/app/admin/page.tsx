'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Loader2, FolderKanban, Cpu, BarChart3, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import ContactDataTable from '@/components/admin/ContactDataTable';

// Stats Card Component
const StatCard = ({ 
  title, 
  value, 
  icon, 
  href, 
  loading 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ReactNode; 
  href: string;
  loading: boolean;
}) => (
  <Link 
    href={href}
    className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors"
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-medium text-gray-300">{title}</h3>
      <div className="text-fuchsia-500">{icon}</div>
    </div>
    <div className="text-2xl font-bold text-white">
      {loading ? <Loader2 className="h-6 w-6 animate-spin text-gray-500" /> : value}
    </div>
  </Link>
);

export default function AdminDashboard() {
  const { data: session } = useSession();
  // Stats state
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    technologies: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch project count
        const projectsResponse = await fetch('/api/projects');
        const projectsData = await projectsResponse.json();
        
        // Fetch skills count
        const skillsResponse = await fetch('/api/skills');
        const skillsData = await skillsResponse.json();

        // Fetch technologies count
        const technologiesResponse = await fetch('/api/technologies');
        const technologiesData = await technologiesResponse.json();

        setStats({
          projects: projectsData.length,
          skills: skillsData.length,
          technologies: technologiesData.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your portfolio content from this central dashboard.</p>
        </div>
        
        {session && (
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <p className="text-gray-400">Logged in as <span className="text-white">{session.user?.name}</span></p>
            <button 
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title="Projects" 
          value={stats.projects} 
          icon={<FolderKanban size={24} />}
          href="/admin/projects"
          loading={loading}
        />
        <StatCard 
          title="Skills" 
          value={stats.skills} 
          icon={<BarChart3 size={24} />}
          href="/admin/skills"
          loading={loading}
        />
        <StatCard 
          title="Technologies" 
          value={stats.technologies} 
          icon={<Cpu size={24} />}
          href="/admin/technologies"
          loading={loading}
        />
      </div>

      {/* Contact Submissions */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Contact Submissions</h2>
        <ContactDataTable />
      </section>
    </div>
  );
} 