'use client';

import Navbar from '@/components/layout/Navbar';
import ProfileSection from '@/components/sections/about/ProfileSection';
import SkillsSection from '@/components/sections/about/SkillsSection';

export default function About() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <ProfileSection />
      <SkillsSection />
    </main>
  );
} 