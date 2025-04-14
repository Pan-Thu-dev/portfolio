// This can be a server file if data needs fetching, or just a simple data structure file.
// For simplicity, we'll keep it as static data for now.

import { firestore } from '@/lib/firebaseAdmin';
import { Project } from '@/types/project';

// Function to get all projects from Firestore
export async function getProjects(): Promise<Project[]> {
  if (!firestore) {
    console.error("Firestore is not initialized in projects-data.ts");
    return []; // Return empty if Firestore isn't ready
  }

  try {
    const projectsCol = firestore.collection('projects');
    // Optional: Add ordering, e.g., by a 'order' field or 'createdAt'
    // const q = query(projectsCol, orderBy("order", "asc"));
    const projectSnapshot = await projectsCol.get();
    const projectsList = projectSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Convert Firestore Timestamp to a serializable format
      // Check if createdAt exists and is a Firestore Timestamp
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        // Convert to ISO string format
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      
      // Handle any other timestamp fields if they exist
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        data.updatedAt = data.updatedAt.toDate().toISOString();
      }
      
      // Make sure imageUrl is never empty or undefined
      if (!data.imageUrl || data.imageUrl.trim() === '') {
        data.imageUrl = '/assets/images/projects/placeholder-project.jpg';
      }
      
      return {
        ...data
      };
    }) as Project[];
    return projectsList;
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    return []; // Return empty array on error
  }
}

// Function to get a single project by its slug from Firestore
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!firestore) {
    console.error("Firestore is not initialized in projects-data.ts");
    return undefined;
  }

  try {
    const projectsCol = firestore.collection('projects');
    const q = projectsCol.where('slug', '==', slug).limit(1);
    const projectSnapshot = await q.get();

    if (projectSnapshot.empty) {
      return undefined; // No project found with that slug
    }

    // Should only be one doc due to limit(1)
    const projectDoc = projectSnapshot.docs[0];
    const data = projectDoc.data();
    
    // Convert Firestore Timestamp to a serializable format
    if (data.createdAt && typeof data.createdAt.toDate === 'function') {
      data.createdAt = data.createdAt.toDate().toISOString();
    }
    
    // Handle any other timestamp fields if they exist
    if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
      data.updatedAt = data.updatedAt.toDate().toISOString();
    }
    
    // Make sure imageUrl is never empty or undefined
    if (!data.imageUrl || data.imageUrl.trim() === '') {
      data.imageUrl = '/assets/images/projects/placeholder-project.jpg';
    }
    
    return data as Project;
  } catch (error) {
    console.error(`Error fetching project with slug "${slug}" from Firestore:`, error);
    return undefined; // Return undefined on error
  }
}

// --- Keep the original static data commented out for reference ---
/*
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
*/ 