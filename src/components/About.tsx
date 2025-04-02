"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Skill {
  name: string;
  level: number;
  category: "frontend" | "backend" | "tools";
}

const skills: Skill[] = [
  { name: "React", level: 90, category: "frontend" },
  { name: "TypeScript", level: 85, category: "frontend" },
  { name: "Next.js", level: 85, category: "frontend" },
  { name: "Node.js", level: 80, category: "backend" },
  { name: "Python", level: 75, category: "backend" },
  { name: "Git", level: 85, category: "tools" },
];

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  const handleDownloadResume = () => {
    // Replace with your actual resume file path
    const resumeUrl = "/resume.pdf";
    window.open(resumeUrl, "_blank");
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Bio Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <p className="text-muted-foreground text-lg mb-6">
              I am a passionate full-stack developer with expertise in modern web technologies.
              My journey in software development started with a deep curiosity for creating
              impactful digital experiences. I specialize in building scalable web applications
              using React, Next.js, and Node.js.
            </p>
            <Button
              onClick={handleDownloadResume}
              className="flex items-center gap-2"
              variant="default"
            >
              <Download size={16} />
              Download Resume
            </Button>
          </motion.div>

          {/* Skills Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Skills & Expertise</h3>
            
            {/* Frontend Skills */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Frontend Development</h4>
              {skills
                .filter((skill) => skill.category === "frontend")
                .map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
            </div>

            {/* Backend Skills */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Backend Development</h4>
              {skills
                .filter((skill) => skill.category === "backend")
                .map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
            </div>

            {/* Tools & Others */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Tools & Others</h4>
              {skills
                .filter((skill) => skill.category === "tools")
                .map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection; 