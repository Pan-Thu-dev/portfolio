'use client'; // This component needs client-side interaction (state, fetch, delete)

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import { Project } from '@/types/project';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';

type ProjectWithId = Project & { id: string };

const AdminProjectsPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete project');
      }
      // Remove deleted project from state
      setProjects(prev => prev.filter(p => p.id !== id));
      alert('Project deleted successfully.');
      router.refresh(); // Refresh server components if needed elsewhere
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
       alert(`Error deleting project: ${error}`); // Show error in alert
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" /></div>;
  }

  if (error) {
    return <p className="text-red-500">Error loading projects: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Manage Projects</h2>
        <Button href="/admin/projects/new">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects found. Add your first project!</p>
      ) : (
        <div className="overflow-x-auto bg-[#0f0f0f] rounded-lg border border-gray-800">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Slug</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#0f0f0f] divide-y divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{project.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link href={`/admin/projects/edit/${project.id}`} className="text-cyan-400 hover:text-cyan-300 inline-flex items-center" title="Edit">
                      <Edit className="h-4 w-4" /> <span className="sr-only">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50 inline-flex items-center"
                      title="Delete"
                    >
                      {deletingId === project.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                       <span className="sr-only">Delete</span>
                    </button>
                     {/* Optional: View Live Link */}
                     {project.hostedUrl && (
                         <Link href={project.hostedUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 inline-flex items-center" title="View Live">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                             <span className="sr-only">View Live</span>
                         </Link>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsPage; 