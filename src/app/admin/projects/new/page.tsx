import { AdminHeader, ProjectForm } from '@/components/admin';

const AddProjectPage = () => {
  return (
    <div>
      <AdminHeader 
        title="Add New Project" 
        description="Create a new project for your portfolio."
      />
      <ProjectForm />
    </div>
  );
};

export default AddProjectPage; 