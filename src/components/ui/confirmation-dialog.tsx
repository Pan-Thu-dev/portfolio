'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from '@/components/ui/button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isProcessing = false
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-medium text-white">{title}</h3>
            </div>
            <button 
              onClick={onCancel} 
              className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-4">
            <p className="text-gray-300">{message}</p>
          </div>
          
          {/* Footer */}
          <div className="flex justify-end space-x-3 p-4 bg-gray-800/50">
            <Button 
              variant="secondary"
              onClick={onCancel}
              disabled={isProcessing}
            >
              {cancelLabel}
            </Button>
            <Button 
              variant="primary"
              onClick={onConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : confirmLabel}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ConfirmationDialog; 