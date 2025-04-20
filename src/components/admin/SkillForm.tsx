'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import { Skill } from '@/types/skill';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface SkillFormProps {
  initialData?: Skill; // Pass existing data for editing
  isEditing?: boolean;
}

const SkillForm = ({ initialData, isEditing = false }: SkillFormProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [level, setLevel] = useState<number | string>(50); // Default level
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLevel(initialData.level);
    }
  }, [initialData]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or numbers
    if (value === '' || /^[0-9]+$/.test(value)) {
      setLevel(value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const skillLevel = parseInt(level as string, 10);
    if (isNaN(skillLevel) || skillLevel < 0 || skillLevel > 100) {
        setError("Level must be a number between 0 and 100.");
        setLoading(false);
        return;
    }

    const apiUrl = isEditing ? `/api/skills/${initialData?.id}` : '/api/skills';
    const method = isEditing ? 'PUT' : 'POST';
    const body = JSON.stringify({ name, level: skillLevel });

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} skill`);
      }

      // Show success toast notification
      showToast(
        `Skill ${isEditing ? 'updated' : 'created'} successfully!`, 
        'success'
      );
      
      router.push('/admin/skills'); // Redirect to list
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Skill Name *</label>
        <input
          type="text" name="name" id="name" value={name}
          onChange={(e) => setName(e.target.value)} required
          className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
        />
      </div>

      {/* Level */}
      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-1">Proficiency Level (0-100) *</label>
        <input
          type="number" name="level" id="level" value={level}
          onChange={handleLevelChange} required min="0" max="100" step="1"
          className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Saving...' : (isEditing ? 'Update Skill' : 'Create Skill')}
        </Button>
      </div>
    </form>
  );
};

export default SkillForm; 