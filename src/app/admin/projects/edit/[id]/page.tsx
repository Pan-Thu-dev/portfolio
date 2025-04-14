'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader, ProjectForm } from '@/components/admin';
import { Project } from '@/types/project';
import { Loader2 } from 'lucide-react';

type ProjectWithId = Project & { id: string };

const EditProjectPage = () => {
  const params = useParams();
  const id = params.id as string; // Get ID from route params
  const [project, setProject] = useState<ProjectWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Don't fetch if ID is not available yet

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
           if (response.status === 404) throw new Error('Project not found');
          throw new Error('Failed to fetch project data');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]); // Re-fetch if ID changes

  if (loading) {
     return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" /></div>;
  }

  if (error) {
    return <p className="text-red-500">Error loading project: {error}</p>;
  }

   if (!project) {
    // This case might occur briefly or if fetch failed silently
    return <p className="text-gray-400">Project data could not be loaded.</p>;
  }


  return (
    <div>
      <AdminHeader 
        title={`Edit Project: ${project.title}`} 
        description="Update the details of your existing project."
      />
      <ProjectForm initialData={project} isEditing={true} />
    </div>
  );
};

export default EditProjectPage; 