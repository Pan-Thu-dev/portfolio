'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/badge';
import { Project } from '@/types/project'; // Updated import

interface ProjectCardProps {
  project: Project;
  index: number; // For staggering animations
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { slug, title, description, technologies, imageUrl } = project;

  // Function to limit description to a certain number of words
  const truncateDescription = (text: string, wordLimit: number = 15) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-800 bg-[#0f0f0f] transition-all hover:shadow-lg hover:border-gray-700 h-full"
    >
      <Link href={`/projects/${slug}`} className="absolute inset-0 z-10" aria-label={`View details for ${title}`}>
        <span className="sr-only">View Details</span>
      </Link>
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Thumbnail for ${title}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust sizes based on your grid layout
        />
         {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mb-4 text-sm text-gray-400 h-[3.0rem] line-clamp-3">{truncateDescription(description)}</p>
        <div className="mb-2 flex flex-wrap gap-2 mt-auto">
          {technologies.slice(0, 4).map((tech) => ( // Show limited tags on card
            <Badge key={tech}>{tech}</Badge>
          ))}
          {technologies.length > 4 && <Badge>...</Badge>}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 