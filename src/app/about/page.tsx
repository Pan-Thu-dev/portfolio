import Navbar from '@/components/layout/Navbar';
import ProfileSection from '@/components/sections/about/ProfileSection';
import SkillsSection from '@/components/sections/about/SkillsSection';
import { getSkills, getTechnologies } from './skills-data';

// Make the component async
export default async function About() {
  // Fetch data from Firestore
  const skills = await getSkills();
  const technologies = await getTechnologies(); // This now returns string[]

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <ProfileSection />
      {/* Pass the fetched data to SkillsSection */}
      <SkillsSection skills={skills} technologies={technologies} />
    </main>
  );
} 