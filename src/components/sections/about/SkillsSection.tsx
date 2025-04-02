'use client';

import { motion } from 'framer-motion';
import SectionTitle from '@/components/ui/section-title';

const skills = [
  { name: 'React', level: 90 },
  { name: 'Next.js', level: 85 },
  { name: 'JavaScript', level: 90 },
  { name: 'TypeScript', level: 80 },
  { name: 'TailwindCSS', level: 85 },
  { name: 'Node.js', level: 80 },
  { name: 'Firebase', level: 75 },
  { name: 'MongoDB', level: 70 },
];

const technologies = [
  'React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Firebase', 
  'Node.js', 'Express', 'MongoDB', 'Git', 'GitHub', 'Vercel',
  'Framer Motion', 'REST API', 'GraphQL', 'Responsive Design'
];

const SkillsSection = () => {
  return (
    <section className="py-12 px-4 md:px-6 bg-[#0f0f0f]">
      <div className="container mx-auto">
        <SectionTitle title="My Skills" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Technical Proficiency</h3>
            {skills.map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">{skill.name}</span>
                  <span className="text-gray-400">{skill.level}%</span>
                </div>
                <motion.div 
                  className="h-2 bg-gray-700 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: 0.2 * index, ease: "easeOut" }}
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Technologies & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection; 