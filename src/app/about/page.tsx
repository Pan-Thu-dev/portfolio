import Navbar from '@/components/layout/Navbar';
import ProfileSection from '@/components/sections/about/ProfileSection';
import SkillsSection from '@/components/sections/about/SkillsSection';
import { getSkills, getTechnologies } from './skills-data';

// This will be a server component by default
export default function About() {
  // Get data from environment variables on the server
  const skills = getSkills();
  const technologies = getTechnologies();
  
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <ProfileSection />
      <SkillsSection skills={skills} technologies={technologies} />
    </main>
  );
} 