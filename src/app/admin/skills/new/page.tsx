import { AdminHeader } from '@/components/admin';

const AddSkillPage = () => {
  return (
    <div>
      <AdminHeader 
        title="Add New Skill" 
        description="Add a new skill to your portfolio."
      />
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-400">
          This feature is coming soon! You will be able to add skills with proficiency levels here.
        </p>
      </div>
    </div>
  );
};

export default AddSkillPage; 