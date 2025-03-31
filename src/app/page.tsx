import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'

export default function Home() {
  return (
   <main className="min-h-screen bg-white dark:bg-gray-900">
    <Navbar />
    <Hero />
   </main>
  );
}
