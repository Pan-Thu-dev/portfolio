// This can be a server file if data needs fetching, or just a simple data structure file.
// For simplicity, we'll keep it as static data for now.

import { Project } from '@/types/project';

const projects: Project[] = [
  {
    slug: 'awesome-app',
    title: 'Awesome App',
    description: 'A revolutionary application that changes the way you do things.',
    longDescription: 'Awesome App is built with the latest technologies to provide a seamless user experience. It features real-time updates, collaborative tools, and a beautiful interface designed for productivity. This project challenged me to integrate complex backend logic with a dynamic frontend.',
    technologies: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Firebase'],
    imageUrl: '/assets/images/projects/project-1.png',
    hostedUrl: 'https://example.com/awesome-app',
    githubUrl: 'https://github.com/your-username/awesome-app',
    features: [
      'Real-time data synchronization',
      'User authentication and authorization',
      'Responsive design for all devices',
      'Interactive dashboard',
    ],
    screenshots: [
        '/assets/images/projects/awesome-app-ss1.png',
        '/assets/images/projects/awesome-app-ss2.png',
        '/assets/images/projects/awesome-app-ss3.png',
    ]
  },
  {
    slug: 'cool-tool',
    title: 'Cool Tool',
    description: 'A handy utility tool for developers to streamline their workflow.',
    longDescription: 'Cool Tool started as a personal project to solve a common development problem. It offers various utilities like code formatting, JSON validation, and text manipulation, all within a clean and intuitive interface. The focus was on performance and ease of use.',
    technologies: ['JavaScript', 'Node.js', 'Express', 'HTML', 'CSS'],
    imageUrl: '/assets/images/projects/project-2.png',
    githubUrl: 'https://github.com/your-username/cool-tool',
    features: [
        'Multiple developer utilities',
        'Fast and lightweight',
        'Cross-platform compatibility (web-based)',
        'Minimalistic UI',
    ],
  },
  {
    slug: 'portfolio-v1',
    title: 'Portfolio Website V1',
    description: 'The first version of my personal portfolio website.',
    longDescription: 'This project represents my initial foray into building a personal brand online. It was developed using foundational web technologies and served as a great learning experience in web design and deployment.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    imageUrl: '/assets/images/projects/project-3.png',
    hostedUrl: 'https://example.com/portfolio-v1',
    githubUrl: 'https://github.com/your-username/portfolio-v1',
    features: [
        'Static site generation',
        'Basic animations',
        'Contact form integration',
    ],
  },  
];

// Function to get all projects
export function getProjects(): Project[] {
  // In a real app, this might fetch from a database or CMS
  return projects;
}

// Function to get a single project by its slug
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
} 