'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({ 
  children, 
  href, 
  variant = 'primary', 
  className = '',
  external = false,
  onClick,
  type = 'button',
  disabled = false
}: ButtonProps) => {
  const baseStyles = 'inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium transition-all';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90 disabled:opacity-50',
    secondary: 'border border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 disabled:opacity-50'
  };
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  if (href) {
    const linkProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    
    return (
      <Link href={href} className={buttonStyles} {...linkProps}>
        {children}
      </Link>
    );
  }
  
  return (
    <button 
      className={buttonStyles} 
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
