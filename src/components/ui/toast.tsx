'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-900/90 text-green-100' : 'bg-red-900/90 text-red-100'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 text-green-300" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-300" />
      )}
      <p className="font-medium">{message}</p>
      <button 
        onClick={onClose} 
        className="ml-3 hover:bg-black/10 p-1 rounded-full transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export default Toast; 