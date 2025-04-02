'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Button from '@/components/ui/button';
import SectionTitle from '@/components/ui/section-title';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 md:px-6 bg-[#0a0a0a]">
      <div className="container mx-auto">
        <SectionTitle title="About Me" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <p className="text-gray-300 md:text-lg">
            I&apos;m a passionate full-stack developer with expertise in building modern web applications.
            With a focus on creating intuitive and responsive user interfaces, I strive to deliver
            high-quality code that solves real-world problems.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button href="/about">
              Learn More
            </Button>
            <Button 
              href="/assets/docs/resume.pdf" 
              variant="secondary" 
              external={true}
            >
              Resume
              <FileText className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;