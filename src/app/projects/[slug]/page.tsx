import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import { getProjectBySlug, getProjects } from '../projects-data';
import Navbar from '@/components/layout/Navbar';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

// Generate static paths for all projects at build time
export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Optional: Generate metadata dynamically
export async function generateMetadata(props: { params: tParams }) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: 'Project Not Found' };
  }
  return {
    title: `${project.title} - Project Details`,
    description: project.description,
  };
}

type tParams = Promise<{ slug: string }>;

export default async function ProjectDetailsPage(props: { params: tParams }) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  // If project not found, show 404 page
  if (!project) {
    notFound();
  }

  const {
    title,
    longDescription,
    technologies,
    imageUrl,
    hostedUrl,
    githubUrl,
    features,
    screenshots
  } = project;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-300">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 py-24 md:py-32">
        {/* Header Section */}
        <div className="mb-12 md:mb-16 text-center">
           <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500">
            {title}
          </h1>
           {/* Technology Badges */}
           <div className="flex flex-wrap justify-center gap-2 mb-6">
            {technologies.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
           {/* Links */}
           <div className="flex justify-center gap-4">
            {hostedUrl && (
              <Button href={hostedUrl} external variant="secondary">
                Live Demo <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button href={githubUrl} external variant="secondary">
              GitHub <Github className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column (Description, Features) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-800">
              <Image
                src={imageUrl}
                alt={`Main image for ${title}`}
                fill
                className="object-cover"
                priority // Prioritize loading the main image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
              />
            </div>

            {/* Long Description */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">About the Project</h2>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                {longDescription}
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Key Features</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column (Screenshots, maybe related projects later) */}
          <div className="lg:col-span-1 space-y-8">
            {screenshots && screenshots.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Screenshots</h2>
                <div className="space-y-4">
                  {screenshots.map((ss, index) => (
                    <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-800">
                       <Image
                        src={ss}
                        alt={`Screenshot ${index + 1} for ${title}`}
                        fill
                        className="object-cover"
                        loading="lazy" // Lazy load screenshots
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
             {/* You could add a "Related Projects" section here later */}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-16 text-center">
            <Button href="/#projects">
                Back to Projects
            </Button>
        </div>

      </div>
    </main>
  );
}