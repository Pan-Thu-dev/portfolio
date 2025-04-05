import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

const Badge = ({ children, className = '' }: BadgeProps) => {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge; 