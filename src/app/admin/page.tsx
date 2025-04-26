"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  FolderKanban,
  Cpu,
  BarChart3,
  LogOut,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/firebase/auth";
import { isAllowedAdmin } from "@/lib/firebase/permissions";
import { useRouter } from "next/navigation";
import ContactDataTable from "@/components/admin/ContactDataTable";

// Stats Card Component
const StatCard = ({
  title,
  value,
  icon,
  href,
  loading,
  error,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  loading: boolean;
  error?: boolean;
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
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      ) : error ? (
        <span className="text-red-400 text-base">Error loading</span>
      ) : (
        value
      )}
    </div>
  </Link>
);

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    technologies: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Check authorization and redirect if not logged in
  useEffect(() => {
    if (!authLoading) {
      console.log("Auth state in admin page:", user?.email || "No user");
      if (!user) {
        router.push("/admin/login");
      } else if (!isAllowedAdmin(user.email || "")) {
        setIsAuthorized(false);
      }
    }
  }, [user, authLoading, router]);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(false);
    setDebugInfo(null);

    try {
      console.log("Fetching stats with user:", user.email);
      // Fetch directly without authentication
      const [projectsRes, skillsRes, techRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/skills"),
        fetch("/api/technologies"),
      ]);

      // Check responses
      if (!projectsRes.ok) {
        throw new Error(`Projects API error: ${projectsRes.status}`);
      }
      if (!skillsRes.ok) {
        throw new Error(`Skills API error: ${skillsRes.status}`);
      }
      if (!techRes.ok) {
        throw new Error(`Technologies API error: ${techRes.status}`);
      }

      // Parse data
      const projectsData = await projectsRes.json();
      const skillsData = await skillsRes.json();
      const techData = await techRes.json();

      // Log successful results
      console.log("Fetched projects:", projectsData?.length || 0);
      console.log("Fetched skills:", skillsData?.length || 0);
      console.log("Fetched technologies:", techData?.length || 0);

      // Update stats
      setStats({
        projects: Array.isArray(projectsData) ? projectsData.length : 0,
        skills: Array.isArray(skillsData) ? skillsData.length : 0,
        technologies: Array.isArray(techData) ? techData.length : 0,
      });
    } catch (error: Error | unknown) {
      console.error("Error fetching stats:", error);
      setDebugInfo(
        `Fetch error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchStats();
    }
  }, [user, authLoading, fetchStats]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  // Show loading state during authentication check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
      </div>
    );
  }

  // Display unauthorized message
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="bg-yellow-500/10 p-4 rounded-full mb-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
        <p className="text-gray-400 max-w-md mb-6">
          Your email address is not authorized to access the admin panel. Please
          contact the administrator for access.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-md flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
          >
            Return to Website
          </Link>
        </div>
      </div>
    );
  }

  // Only show dashboard if authenticated
  if (!user) return null;

  return (
    <div>
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your portfolio content from this central dashboard.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <p className="text-gray-400">
            Logged in as <span className="text-white">{user.email}</span>
          </p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {debugInfo && (
        <div className="mb-4 p-4 bg-yellow-500/10 rounded-lg">
          <p className="text-yellow-300 text-sm font-mono">{debugInfo}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Projects"
          value={stats.projects}
          icon={<FolderKanban size={24} />}
          href="/admin/projects"
          loading={loading}
          error={error}
        />
        <StatCard
          title="Skills"
          value={stats.skills}
          icon={<BarChart3 size={24} />}
          href="/admin/skills"
          loading={loading}
          error={error}
        />
        <StatCard
          title="Technologies"
          value={stats.technologies}
          icon={<Cpu size={24} />}
          href="/admin/technologies"
          loading={loading}
          error={error}
        />
      </div>

      {/* Contact Submissions */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Contact Submissions
        </h2>
        <ContactDataTable />
      </section>
    </div>
  );
}
