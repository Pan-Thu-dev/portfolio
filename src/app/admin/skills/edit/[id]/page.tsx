'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader, SkillForm } from '@/components/admin';
import { Skill } from '@/types/skill';
import { Loader2 } from 'lucide-react';

const EditSkillPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSkill = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/skills/${id}`);
        if (!response.ok) {
           if (response.status === 404) throw new Error('Skill not found');
          throw new Error('Failed to fetch skill data');
        }
        const data = await response.json();
        setSkill(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  if (loading) {
     return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" /></div>;
  }

  if (error) {
    return <p className="text-red-500">Error loading skill: {error}</p>;
  }

   if (!skill) {
    return <p className="text-gray-400">Skill data could not be loaded.</p>;
  }

  return (
    <div>
      <AdminHeader
        title={`Edit Skill: ${skill.name}`}
        description="Update the skill name or proficiency level."
      />
      <SkillForm initialData={skill} isEditing={true} />
    </div>
  );
};

export default EditSkillPage; 