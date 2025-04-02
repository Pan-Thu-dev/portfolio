import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AboutSection from '@/components/About'

export default function Home() {
  return (
   <main className="min-h-screen bg-white dark:bg-gray-900">
    <Navbar />
    <Hero />
    <AboutSection />
   </main>
  );
}
