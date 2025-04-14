import { AdminHeader, SkillForm } from '@/components/admin';

const AddSkillPage = () => {
  return (
    <div>
      <AdminHeader
        title="Add New Skill"
        description="Define a new skill and its proficiency level."
      />
      <SkillForm />
    </div>
  );
};

export default AddSkillPage; 