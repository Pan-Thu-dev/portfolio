'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import { AdminHeader } from '@/components/admin';
import { Technology } from '@/types/technology';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';

const AdminTechnologiesPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; techId: string | null }>({
    isOpen: false,
    techId: null
  });

  useEffect(() => {
    const fetchTech = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/technologies');
        if (!response.ok) {
          throw new Error('Failed to fetch technologies');
        }
        const data = await response.json();
        setTechnologies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchTech();
  }, []);

  const confirmDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      techId: id
    });
  };

  const cancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      techId: null
    });
  };

  const handleDelete = async () => {
    const id = confirmDialog.techId;
    if (!id) return;
    
    setDeletingId(id);
    setError(null);
    setConfirmDialog({ isOpen: false, techId: null });
    
    try {
      const response = await fetch(`/api/technologies/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete technology');
      }
      setTechnologies(prev => prev.filter(t => t.id !== id));
      showToast('Technology deleted successfully', 'success');
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      showToast(`Error deleting technology: ${errorMessage}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

   if (error) {
    return <p className="text-red-500">Error loading technologies: {error}</p>;
  }

  return (
    <div>
      <AdminHeader
        title="Manage Technologies"
        description="View, edit, and delete your technologies."
        action={{
          label: "Add New Technology",
          href: "/admin/technologies/new",
          icon: PlusCircle
        }}
      />

      {loading ? (
        <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" /></div>
      ) : technologies.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No technologies found. Add your first one!</p>
          <Button href="/admin/technologies/new"><PlusCircle className="mr-2 h-4 w-4" /> Add New Technology</Button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800/50 rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {technologies.map((tech) => (
                <tr key={tech.id} className="hover:bg-gray-800/90 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{tech.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link href={`/admin/technologies/edit/${tech.id}`} className="text-cyan-400 hover:text-cyan-300 inline-flex items-center" title="Edit">
                      <Edit className="h-4 w-4" /> <span className="sr-only">Edit</span>
                    </Link>
                    <button
                      onClick={() => confirmDelete(tech.id!)}
                      disabled={deletingId === tech.id}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50 inline-flex items-center"
                      title="Delete"
                    >
                      {deletingId === tech.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                       <span className="sr-only">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this technology? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        isProcessing={!!deletingId}
      />
    </div>
  );
};

export default AdminTechnologiesPage; 