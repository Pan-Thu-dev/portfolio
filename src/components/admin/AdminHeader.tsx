import Button from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
}

const AdminHeader = ({ title, description, action }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        {description && <p className="text-gray-400">{description}</p>}
      </div>
      
      {action && (
        <div className="mt-4 md:mt-0">
          <Button href={action.href}>
            {action.icon && <action.icon className="mr-2 h-4 w-4" />}
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminHeader; 