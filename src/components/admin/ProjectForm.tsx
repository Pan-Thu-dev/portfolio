'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import { Project } from '@/types/project';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface ProjectFormProps {
  initialData?: Project & { id: string }; // Pass existing data for editing
  isEditing?: boolean;
}

// Helper to convert array to comma-separated string for textarea
const arrayToText = (arr: string[] | undefined): string => (arr || []).join(', ');
// Helper to convert comma-separated string (or newline) to array
const textToArray = (text: string): string[] => text ? text.split(/,|\n/).map(s => s.trim()).filter(Boolean) : [];

const ProjectForm = ({ initialData, isEditing = false }: ProjectFormProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    technologies: [],
    imageUrl: '',
    hostedUrl: '',
    githubUrl: '',
    features: [],
    screenshots: [],
  });
  const [techText, setTechText] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [screenshotsText, setScreenshotsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTechText(arrayToText(initialData.technologies));
      setFeaturesText(arrayToText(initialData.features));
      setScreenshotsText(arrayToText(initialData.screenshots));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof Project) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textValue = e.target.value;
      setter(textValue);
      setFormData(prev => ({ ...prev, [field]: textToArray(textValue) }));
    };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = isEditing ? `/api/projects/${initialData?.id}` : '/api/projects';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} project`);
      }

      // Show success toast notification
      showToast(
        `Project ${isEditing ? 'updated' : 'created'} successfully!`, 
        'success'
      );
      
      router.push('/admin/projects'); // Redirect to the projects list
      router.refresh(); // Refresh server components

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

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required
               className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
      </div>

       {/* Slug (Optional - Auto-generated if empty) */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">Slug (URL Path)</label>
        <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated-if-empty"
               className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
         <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from title. Use lowercase letters, numbers, and hyphens.</p>
      </div>

      {/* Description (Short) */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Short Description *</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={2}
                  className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
      </div>

      {/* Long Description */}
      <div>
        <label htmlFor="longDescription" className="block text-sm font-medium text-gray-300 mb-1">Long Description</label>
        <textarea name="longDescription" id="longDescription" value={formData.longDescription} onChange={handleChange} rows={5}
                  className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
      </div>

       {/* Technologies */}
      <div>
        <label htmlFor="technologies" className="block text-sm font-medium text-gray-300 mb-1">Technologies (comma or newline separated)</label>
        <textarea name="technologies" id="technologies" value={techText} onChange={handleArrayChange(setTechText, 'technologies')} rows={3}
                  className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
      </div>

       {/* Image URL */}
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">Main Image URL</label>
        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange}
               className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
      </div>

       {/* Hosted URL */}
      <div>
        <label htmlFor="hostedUrl" className="block text-sm font-medium text-gray-300 mb-1">Hosted URL (Live Demo)</label>
        <input type="url" name="hostedUrl" id="hostedUrl" value={formData.hostedUrl} onChange={handleChange}
               className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
      </div>

      {/* GitHub URL */}
      <div>
        <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300 mb-1">GitHub URL *</label>
        <input type="url" name="githubUrl" id="githubUrl" value={formData.githubUrl} onChange={handleChange} required
               className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
      </div>

        {/* Features */}
      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-300 mb-1">Key Features (comma or newline separated)</label>
        <textarea name="features" id="features" value={featuresText} onChange={handleArrayChange(setFeaturesText, 'features')} rows={4}
                  className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
      </div>

       {/* Screenshots */}
      <div>
        <label htmlFor="screenshots" className="block text-sm font-medium text-gray-300 mb-1">Screenshot URLs (comma or newline separated)</label>
        <textarea name="screenshots" id="screenshots" value={screenshotsText} onChange={handleArrayChange(setScreenshotsText, 'screenshots')} rows={4}
                  className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500" />
      </div>


      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm; 