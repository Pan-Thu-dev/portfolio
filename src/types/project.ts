import { Timestamp } from 'firebase-admin/firestore';

export type Project = {
    slug: string; // URL-friendly identifier
    title: string;
    description: string; // Short description for the card
    longDescription: string; // Detailed description for the project page
    technologies: string[];
    imageUrl: string; // Path to the thumbnail image
    hostedUrl?: string; // Optional link to live demo/site
    githubUrl: string; // Link to GitHub repository
    features: string[]; // Key features for the details page
    screenshots?: string[]; // Optional paths to screenshot images for details page
    createdAt?: string | Timestamp; // ISO date string or Firestore Timestamp
    updatedAt?: string | Timestamp; // ISO date string or Firestore Timestamp
  }; 