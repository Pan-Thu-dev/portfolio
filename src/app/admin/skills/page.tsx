'use client';

import { AdminHeader } from '@/components/admin';
import { PlusCircle } from 'lucide-react';
import Button from '@/components/ui/button';

const AdminSkillsPage = () => {
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
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-400 mb-4">Skills management functionality will be implemented soon!</p>
        <Button href="/admin/skills/new">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Skill
        </Button>
      </div>
    </div>
  );
};

export default AdminSkillsPage; 