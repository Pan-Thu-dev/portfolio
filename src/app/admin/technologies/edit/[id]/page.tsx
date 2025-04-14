'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader, TechnologyForm } from '@/components/admin';
import { Technology } from '@/types/technology';
import { Loader2 } from 'lucide-react';

const EditTechnologyPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTech = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/technologies/${id}`);
        if (!response.ok) {
           if (response.status === 404) throw new Error('Technology not found');
          throw new Error('Failed to fetch technology data');
        }
        const data = await response.json();
        setTechnology(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchTech();
  }, [id]);

  if (loading) {
     return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" /></div>;
  }

  if (error) {
    return <p className="text-red-500">Error loading technology: {error}</p>;
  }

   if (!technology) {
    return <p className="text-gray-400">Technology data could not be loaded.</p>;
  }

  return (
    <div>
      <AdminHeader
        title={`Edit Technology: ${technology.name}`}
        description="Update the technology name."
      />
      <TechnologyForm initialData={technology} isEditing={true} />
    </div>
  );
};

export default EditTechnologyPage; 