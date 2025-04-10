'use client';

import { AdminHeader } from '@/components/admin';
import { PlusCircle } from 'lucide-react';
import Button from '@/components/ui/button';

const AdminTechnologiesPage = () => {
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
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-400 mb-4">Technologies management functionality will be implemented soon!</p>
        <Button href="/admin/technologies/new">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Technology
        </Button>
      </div>
    </div>
  );
};

export default AdminTechnologiesPage; 