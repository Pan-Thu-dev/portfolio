'use client';

import { AdminHeader } from '@/components/admin';
import { useState } from 'react';
import { AlertTriangle, Save } from 'lucide-react';
import Button from '@/components/ui/button';

const AdminSettingsPage = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simulate saving
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <AdminHeader 
        title="Admin Settings" 
        description="Configure your admin dashboard preferences."
      />
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
        <div className="mb-6 pb-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">General Settings</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <label htmlFor="site-name" className="block text-sm font-medium text-gray-300 mb-2">
                Site Name
              </label>
              <input 
                type="text" 
                id="site-name" 
                className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
                placeholder="My Portfolio" 
              />
            </div>
            
            <div className="md:w-1/2">
              <label htmlFor="site-url" className="block text-sm font-medium text-gray-300 mb-2">
                Site URL
              </label>
              <input 
                type="url" 
                id="site-url" 
                className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 text-white"
                placeholder="https://myportfolio.com" 
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6 pb-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-300 mb-2">Theme</p>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input type="radio" name="theme" className="mr-2" defaultChecked />
                <span>Dark</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="theme" className="mr-2" />
                <span>Light</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Advanced</h2>
          
          <div className="bg-red-900/30 border border-red-700 text-red-400 p-4 rounded mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Danger Zone</p>
              <p className="text-sm">These actions are destructive and cannot be reversed.</p>
            </div>
          </div>
          
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
            Clear Database Cache
          </button>
        </div>
        
        <div className="flex justify-end mt-8">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage; 