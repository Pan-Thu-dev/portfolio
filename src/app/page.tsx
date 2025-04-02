import Navbar from '@/components/layout/Navbar'
import { HeroSection } from '@/components/sections/hero'
import { AboutSection } from '@/components/sections/about'

export default function Home() {
  return (
   <main className="min-h-screen bg-[#0a0a0a]">
    <Navbar />
    <HeroSection />
    <AboutSection />
   </main>
  );
}
