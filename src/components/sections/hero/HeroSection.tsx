'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-[#0a0a0a]">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                Hi, I&apos;m Pan Thu
              </h1>
              <p className="max-w-[600px] text-gray-400 md:text-xl">
                A passionate full-stack developer crafting beautiful and functional web experiences
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="#projects"
                className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-8 text-sm font-medium text-white transition-all hover:opacity-90"
              >
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-700 bg-transparent px-8 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
              >
                Contact Me
              </Link>
            </div>
            <div className="flex gap-4 mt-4">
              <Link
                href="https://github.com/Pan-Thu-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-100"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/pan-thu-6079a8320/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-100"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.2,
              type: "spring",
              stiffness: 100
            }}
            className="flex items-center justify-center"
          >
            <div className="relative aspect-square w-full max-w-[400px] group">
              <div className="relative w-full h-full">
                <Image
                  src="/assets/images/profile-pic.svg"
                  alt="Hero Illustration"
                  fill
                  className="object-contain invert brightness-200 filter transition-all duration-300 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/10 to-cyan-500/10 rounded-full blur-3xl scale-95 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 