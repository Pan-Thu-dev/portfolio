// This is a server file that can access environment variables

import { firestore } from '@/lib/firebase/admin';
import { Skill } from '@/types/skill';
import { convertTimestampsToISO } from '@/lib/utils';

// Function to get skills from Firestore
export async function getSkills(): Promise<Skill[]> {
  if (!firestore) {
    console.error("Firestore is not initialized in skills-data.ts");
    return [];
  }
  try {
    const skillsCol = firestore.collection('skills');
    const q = skillsCol.orderBy('level', 'desc'); // Order by level descending
    const snapshot = await q.get();
    const skillsList = snapshot.docs.map(doc => {
        const skill = { id: doc.id, ...doc.data() };
        return convertTimestampsToISO(skill);
    }) as Skill[];
    return skillsList;
  } catch (error) {
    console.error("Error fetching skills from Firestore:", error);
    return [];
  }
}

// Function to get technologies from Firestore
export async function getTechnologies(): Promise<string[]> {
   if (!firestore) {
    console.error("Firestore is not initialized in skills-data.ts");
    return [];
  }
  try {
    const techCol = firestore.collection('technologies');
    const q = techCol.orderBy('name', 'asc'); // Order alphabetically
    const snapshot = await q.get();
    // Return only the names as strings for the current SkillsSection component
    const techList = snapshot.docs.map(doc => doc.data().name as string);
    return techList;
  } catch (error) {
    console.error("Error fetching technologies from Firestore:", error);
    return [];
  }
}

// --- Original static/env data commented out ---
/*
export function getSkills(): Skill[] {
  return [
    { name: 'React', level: Number(process.env.SKILLS_REACT || 90) },
    { name: 'Next.js', level: Number(process.env.SKILLS_NEXTJS || 85) },
    { name: 'JavaScript', level: Number(process.env.SKILLS_JAVASCRIPT || 90) },
    { name: 'TypeScript', level: Number(process.env.SKILLS_TYPESCRIPT || 80) },
    { name: 'TailwindCSS', level: Number(process.env.SKILLS_TAILWINDCSS || 85) },
    { name: 'Node.js', level: Number(process.env.SKILLS_NODEJS || 80) },
    { name: 'Firebase', level: Number(process.env.SKILLS_FIREBASE || 75) },
    { name: 'MongoDB', level: Number(process.env.SKILLS_MONGODB || 70) },
  ];
}

export function getTechnologies(): string[] {
  const techString = process.env.TECHNOLOGIES || 'React,Next.js,TypeScript,TailwindCSS,Firebase,Node.js,Express,MongoDB,Git,GitHub,Vercel,Framer Motion,REST API,GraphQL,Responsive Design';
  return techString.split(',').map(tech => tech.trim());
}
*/ 