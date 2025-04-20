'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import { Technology } from '@/types/technology';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface TechnologyFormProps {
  initialData?: Technology; // Pass existing data for editing
  isEditing?: boolean;
}

const TechnologyForm = ({ initialData, isEditing = false }: TechnologyFormProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = isEditing ? `/api/technologies/${initialData?.id}` : '/api/technologies';
    const method = isEditing ? 'PUT' : 'POST';
    const body = JSON.stringify({ name });

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} technology`);
      }

      // Show success toast notification
      showToast(
        `Technology ${isEditing ? 'updated' : 'created'} successfully!`, 
        'success'
      );
      
      router.push('/admin/technologies'); // Redirect to list
      router.refresh();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f0f0f] p-6 rounded-lg border border-gray-800">
      {error && <p className="text-red-500 bg-red-900/30 p-3 rounded border border-red-700">{error}</p>}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Technology Name *</label>
        <input
          type="text" name="name" id="name" value={name}
          onChange={(e) => setName(e.target.value)} required
          className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Saving...' : (isEditing ? 'Update Technology' : 'Create Technology')}
        </Button>
      </div>
    </form>
  );
};

export default TechnologyForm; 