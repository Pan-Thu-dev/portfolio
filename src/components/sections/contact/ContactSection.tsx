'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Send, Loader2, CheckCircle, AlertTriangle, Facebook } from 'lucide-react';
import Link from 'next/link';
import SectionTitle from '@/components/ui/section-title';
import Button from '@/components/ui/button';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
type FormState = {
  status: FormStatus;
  message: string | null;
};

const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState<FormState>({ status: 'idle', message: null });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState.status === 'loading') return; // Prevent multiple submissions

    setFormState({ status: 'loading', message: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Special handling for database not initialized (503 status)
        if (response.status === 503) {
          throw new Error('The contact database is being set up. Please try again in a few minutes.');
        }
        throw new Error(result.error || `Request failed with status ${response.status}`);
      }

      setFormState({ status: 'success', message: result.message || 'Message sent successfully!' });
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setFormState({ status: 'idle', message: null }), 5000); // Reset after 5s

    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
       setFormState({ status: 'error', message: `Error: ${errorMessage}` });
       setTimeout(() => setFormState({ status: 'idle', message: null }), 7000); // Reset after 7s
    }
  };

  const socialLinks = [
    { name: 'GitHub', Icon: Github, url: 'https://github.com/Pan-Thu-dev' },
    { name: 'LinkedIn', Icon: Linkedin, url: 'https://www.linkedin.com/in/pan-thu-6079a8320/' },
    { name: 'Facebook', Icon: Facebook, url: 'https://www.facebook.com/people/Pan-Thu/100055659474825/' },
  ];

  const contactEmail = "panthu252004@gmail.com";

  return (
    <section id="contact" className="py-20 px-4 md:px-6 bg-[#0f0f0f]">
      <div className="container mx-auto">
        <SectionTitle title="Get In Touch" subtitle="Let's build something amazing together" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={formState.status === 'loading'}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition disabled:opacity-50"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={formState.status === 'loading'}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition disabled:opacity-50"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={formState.status === 'loading'}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition disabled:opacity-50"
                  placeholder="Your message..."
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <Button type="submit" disabled={formState.status === 'loading'} className="w-full sm:w-auto">
                  {formState.status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {formState.status === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
                  {formState.status === 'error' && <AlertTriangle className="mr-2 h-4 w-4" />}
                  {formState.status === 'loading' ? 'Sending...' : formState.status === 'success' ? 'Sent!' : formState.status === 'error' ? 'Send Failed' : 'Send Message'}
                  {formState.status !== 'loading' && formState.status !== 'success' && formState.status !== 'error' && <Send className="ml-2 h-4 w-4" />}
                </Button>
                 {formState.message && (
                    <p className={`text-sm text-center sm:text-right ${formState.status === 'success' ? 'text-green-400' : formState.status === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
                        {formState.message}
                    </p>
                 )}
              </div>
            </form>
          </motion.div>

          {/* Contact Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-8 text-gray-300"
          >
             <div>
                 <h3 className="text-xl font-semibold text-white mb-3">Contact Information</h3>
                 <p>Feel free to reach out via email or connect with me on social media.</p>
                 <p className="mt-2">
                     <a href={`mailto:${contactEmail}`} className="hover:text-fuchsia-400 transition-colors break-all">
                         {contactEmail}
                     </a>
                 </p>
             </div>
             <div>
                 <h3 className="text-xl font-semibold text-white mb-4">Connect With Me</h3>
                 <div className="flex gap-4">
                    {socialLinks.map(({ name, Icon, url }) => (
                        <Link
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Connect on ${name}`}
                        className="text-gray-400 transition-colors hover:text-fuchsia-400"
                        >
                        <Icon className="h-6 w-6" />
                        </Link>
                    ))}
                 </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 