import { AdminHeader } from '@/components/admin';

const AddTechnologyPage = () => {
  return (
    <div>
      <AdminHeader 
        title="Add New Technology" 
        description="Add a new technology to your portfolio."
      />
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-400">
          This feature is coming soon! You will be able to add technologies with logos and categories here.
        </p>
      </div>
    </div>
  );
};

export default AddTechnologyPage; 