'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import SectionTitle from '@/components/ui/section-title';

const ProfileSection = () => {
  return (
    <section className="pt-24 pb-12 px-4 md:px-6">
      <div className="container mx-auto">
        <SectionTitle 
          title="About Me"
          className="mb-16"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <motion.div 
              className="absolute w-[330px] h-[310px] bg-gradient-to-br from-purple-600 to-purple-400 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]"
              animate={{ 
                borderRadius: [
                  "40% 60% 70% 30% / 40% 50% 60% 50%",
                  "50% 70% 60% 40% / 50% 60% 50% 40%",
                  "40% 60% 70% 30% / 40% 50% 60% 50%"
                ]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            ></motion.div>
            
            <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden border-4 border-white z-10">
              <Image 
                src="/assets/images/profile-pic.jpeg" 
                alt="Pan Thu"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-white">
              Full-Stack Developer
            </h2>
            <p className="text-gray-300">
              I&apos;m a passionate full-stack developer with expertise in building modern web applications. 
              With a focus on creating intuitive and responsive user interfaces, I strive to deliver 
              high-quality code that solves real-world problems.
            </p>
            <p className="text-gray-300">
              My journey in web development began with a curiosity for creating interactive experiences. 
              Over the years, I&apos;ve honed my skills in frontend and backend technologies, always staying 
              up-to-date with the latest industry trends and best practices.
            </p>
            <div>
              <Button 
                href="/assets/docs/resume.pdf" 
                external={true}
              >
                Download Resume
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection; 