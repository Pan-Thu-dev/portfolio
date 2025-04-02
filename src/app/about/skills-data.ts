// This is a server file that can access environment variables

export type Skill = {
  name: string;
  level: number;
};

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