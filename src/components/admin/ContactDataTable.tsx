'use client';

import { useState, useEffect } from 'react';
import { Inbox, Loader2, ExternalLink, RefreshCw, LogIn } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  status: string;
};

interface ContactsResponse {
  contacts: ContactSubmission[];
}

export default function ContactDataTable() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('You need to be logged in to view contact submissions');
      }
      
      // Get fresh token directly from the user
      const token = await user.getIdToken(true);
      console.log('Token acquired for contacts API', token ? 'success' : 'failed');
      
      // Use direct fetch with authorization header
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Contacts API response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in again.');
        }
        throw new Error(`Error fetching contacts: ${response.status}`);
      }
      
      const data = await response.json() as ContactsResponse;
      console.log('Contact data received:', data?.contacts?.length || 0);
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      fetchContacts();
    }
  }, [user, authLoading]);

  // Show loading during auth check
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-fuchsia-500 animate-spin mb-4" />
        <p className="text-gray-400">Checking authentication...</p>
      </div>
    );
  }

  // Show auth required message if not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-yellow-500/10 p-3 rounded-full mb-4">
          <LogIn className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">Authentication Required</h3>
        <p className="text-gray-400 max-w-md mb-4">
          You need to be logged in to view contact submissions.
        </p>
        <button 
          onClick={() => router.push('/admin/login')}
          className="px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-600 transition-colors text-white rounded-md flex items-center"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Log In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-fuchsia-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading contact submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-red-500/10 p-3 rounded-full mb-4">
          <ExternalLink className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-red-400 mb-2">{error}</p>
        <button 
          onClick={fetchContacts} 
          className="flex items-center text-fuchsia-500 hover:text-fuchsia-400 transition-colors mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-fuchsia-500/10 p-3 rounded-full mb-4">
          <Inbox className="h-8 w-8 text-fuchsia-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No Contact Submissions Yet</h3>
        <p className="text-gray-400 max-w-md">
          When visitors submit the contact form, their messages will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-sm text-gray-300 font-semibold">Name</th>
              <th className="px-6 py-3 text-sm text-gray-300 font-semibold">Email</th>
              <th className="px-6 py-3 text-sm text-gray-300 font-semibold">Message</th>
              <th className="px-6 py-3 text-sm text-gray-300 font-semibold">Submitted</th>
              <th className="px-6 py-3 text-sm text-gray-300 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {contacts.map(contact => (
              <tr key={contact.id} className="bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 text-white">{contact.name}</td>
                <td className="px-6 py-4">
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                  >
                    {contact.email}
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  <div className="max-w-xs truncate">{contact.message}</div>
                </td>
                <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(contact.submittedAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    contact.status === 'new' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : contact.status === 'read' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {contact.status === 'new' ? 'New' : 
                     contact.status === 'read' ? 'Read' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 