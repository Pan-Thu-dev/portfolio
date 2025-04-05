import Navbar from '@/components/layout/Navbar'
import { HeroSection } from '@/components/sections/hero'
import { AboutSection } from '@/components/sections/about'
import { ProjectsSection } from '@/components/sections/projects'

export default function Home() {
  return (
   <main className="min-h-screen bg-[#0a0a0a]">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <ProjectsSection />
   </main>
  );
}
