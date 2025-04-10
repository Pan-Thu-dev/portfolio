'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Loader2, FolderKanban, Database, Cpu, BarChart3 } from 'lucide-react';

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
  // Stats state
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    technologies: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats (in a real app, this would come from an API)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch project count
        const projectsResponse = await fetch('/api/projects');
        const projectsData = await projectsResponse.json();
        
        // For now, we're just getting counts from the projects API
        // In the future, you would also fetch skills and technologies counts
        setStats({
          projects: projectsData.length,
          skills: 0, // Placeholder until skills API is implemented
          technologies: 0, // Placeholder until technologies API is implemented
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage your portfolio content from this central dashboard.</p>
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

      {/* Quick Links */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/admin/projects/new" 
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-fuchsia-500 transition-all"
          >
            <span className="bg-fuchsia-500/10 p-2 rounded text-fuchsia-500">
              <FolderKanban size={18} />
            </span>
            <span>Add New Project</span>
          </Link>
          
          <Link 
            href="/admin/skills/new" 
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-fuchsia-500 transition-all"
          >
            <span className="bg-fuchsia-500/10 p-2 rounded text-fuchsia-500">
              <BarChart3 size={18} />
            </span>
            <span>Add New Skill</span>
          </Link>
          
          <Link 
            href="/admin/technologies/new" 
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-fuchsia-500 transition-all"
          >
            <span className="bg-fuchsia-500/10 p-2 rounded text-fuchsia-500">
              <Cpu size={18} />
            </span>
            <span>Add New Technology</span>
          </Link>
          
          <Link 
            href="/api/database/backup" 
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-fuchsia-500 transition-all"
          >
            <span className="bg-fuchsia-500/10 p-2 rounded text-fuchsia-500">
              <Database size={18} />
            </span>
            <span>Backup Database</span>
          </Link>
        </div>
      </section>
    </div>
  );
} 