import { AdminHeader, TechnologyForm } from '@/components/admin';

const AddTechnologyPage = () => {
  return (
    <div>
      <AdminHeader
        title="Add New Technology"
        description="Add a technology or tool you use."
      />
      <TechnologyForm />
    </div>
  );
};

export default AddTechnologyPage; 