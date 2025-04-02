'use client';

import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const SectionTitle = ({ 
  title, 
  subtitle, 
  center = true,
  className = '' 
}: SectionTitleProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${center ? 'text-center' : ''} mb-12 ${className}`}
    >
      <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-gray-400">{subtitle}</p>}
      <div className={`w-16 h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500 mt-3 ${center ? 'mx-auto' : ''}`} />
    </motion.div>
  );
};

export default SectionTitle; 