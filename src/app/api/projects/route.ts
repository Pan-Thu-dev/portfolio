import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Project } from '@/types/project';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';

// GET: Fetch all projects
export async function GET() {
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const projectsCol = firestore.collection('projects');
    const projectSnapshot = await projectsCol.get();
    const projectsList = projectSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as (Project & { id: string })[];
    // Optional: Sort projects, e.g., by title or a timestamp if added
    // projectsList.sort((a, b) => a.title.localeCompare(b.title));
    return NextResponse.json(projectsList, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects.' }, { status: 500 });
  }
}

// POST: Create a new project
export async function POST(request: Request) {
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const projectData = (await request.json()) as Omit<Project, 'slug'> & { slug?: string }; // Slug might be generated or provided

    // Basic Validation (expand as needed)
    if (!projectData.title || !projectData.description || !projectData.githubUrl) {
      return NextResponse.json({ error: 'Missing required project fields' }, { status: 400 });
    }

    // Generate slug if not provided (simple example)
    const slug = projectData.slug || projectData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const newProject = {
      ...projectData,
      slug: slug, // Ensure slug is set
      // Ensure array fields are arrays, even if empty
      technologies: projectData.technologies || [],
      features: projectData.features || [],
      screenshots: projectData.screenshots || [],
      createdAt: Timestamp.now(),
    };

    const projectsCol = firestore.collection('projects');
    const docRef = await projectsCol.add(newProject);

    console.log('Project created with ID:', docRef.id);
    return NextResponse.json({ success: true, id: docRef.id, ...newProject }, { status: 201 });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project.' }, { status: 500 });
  }
} 