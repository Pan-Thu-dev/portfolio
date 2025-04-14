'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import { AdminHeader } from '@/components/admin';
import { Skill } from '@/types/skill';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';

const AdminSkillsPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; skillId: string | null }>({
    isOpen: false,
    skillId: null
  });

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/skills');
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const confirmDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      skillId: id
    });
  };

  const cancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      skillId: null
    });
  };

  const handleDelete = async () => {
    const id = confirmDialog.skillId;
    if (!id) return;
    
    setDeletingId(id);
    setError(null);
    setConfirmDialog({ isOpen: false, skillId: null });
    
    try {
      const response = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete skill');
      }
      setSkills(prev => prev.filter(s => s.id !== id));
      showToast('Skill deleted successfully', 'success');
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      showToast(`Error deleting skill: ${errorMessage}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (error) {
    return <p className="text-red-500">Error loading skills: {error}</p>;
  }

  return (
    <div>
      <AdminHeader
        title="Manage Skills"
        description="View, edit, and delete your skills."
        action={{
          label: "Add New Skill",
          href: "/admin/skills/new",
          icon: PlusCircle
        }}
      />

      {loading ? (
        <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" /></div>
      ) : skills.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">No skills found. Add your first skill!</p>
          <Button href="/admin/skills/new"><PlusCircle className="mr-2 h-4 w-4" /> Add New Skill</Button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800/50 rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-800/90 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{skill.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500" style={{ width: `${skill.level}%` }}></div>
                        </div>
                        <span>{skill.level}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link href={`/admin/skills/edit/${skill.id}`} className="text-cyan-400 hover:text-cyan-300 inline-flex items-center" title="Edit">
                      <Edit className="h-4 w-4" /> <span className="sr-only">Edit</span>
                    </Link>
                    <button
                      onClick={() => confirmDelete(skill.id!)}
                      disabled={deletingId === skill.id}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50 inline-flex items-center"
                      title="Delete"
                    >
                      {deletingId === skill.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        isProcessing={!!deletingId}
      />
    </div>
  );
};

export default AdminSkillsPage; 