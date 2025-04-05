import SectionTitle from '@/components/ui/section-title';
import ProjectCard from '@/components/ui/project-card';
import { getProjects } from '@/app/projects/projects-data'; // Fetch project data

const ProjectsSection = () => {
  const projects = getProjects(); // Get the project data

  return (
    <section id="projects" className="py-20 px-4 md:px-6 bg-[#0a0a0a]">
      <div className="container mx-auto">
        <SectionTitle title="My Projects" subtitle="A selection of my recent work" />

        {/* Using flex instead of grid for better centering control */}
        <div className="flex flex-wrap justify-center gap-8">
          {projects.map((project, index) => (
            <div key={project.slug} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] max-w-md h-full">
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>
        {/* Optional: Add a button to view all projects if you have many */}
        {/* <div className="mt-12 text-center">
          <Button href="/projects">View All Projects</Button>
        </div> */}
      </div>
    </section>
  );
};

export default ProjectsSection; 