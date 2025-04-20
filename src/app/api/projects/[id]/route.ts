import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Project } from '@/types/project';

interface RouteContext {
  params: {
    id: string;
  };
}

// GET: Fetch a single project by ID
export async function GET(request: Request, context: RouteContext) {
  const { id } = context.params;
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const projectDocRef = firestore.collection('projects').doc(id);
    const projectSnap = await projectDocRef.get();

    if (!projectSnap.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectData = { id: projectSnap.id, ...projectSnap.data() } as Project & { id: string };
    return NextResponse.json(projectData, { status: 200 });

  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch project.' }, { status: 500 });
  }
}

// PUT: Update an existing project by ID
export async function PUT(request: Request, context: RouteContext) {
  const { id } = context.params;
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const projectData = (await request.json()) as Partial<Project>; // Allow partial updates
    const projectDocRef = firestore.collection('projects').doc(id);

    // Check if document exists before updating
    const projectSnap = await projectDocRef.get();
    if (!projectSnap.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Basic Validation (optional, depends on requirements)
    // if (projectData.title === '') { ... }

    // Prepare update data
    const updatePayload = {
        ...projectData,
        // Ensure arrays are handled correctly if provided
        technologies: projectData.technologies || projectSnap.data()?.technologies || [],
        features: projectData.features || projectSnap.data()?.features || [],
        screenshots: projectData.screenshots || projectSnap.data()?.screenshots || [],
        updatedAt: Timestamp.now(),
    };
     // Regenerate slug if title changes and slug is not explicitly provided
     if (projectData.title && !projectData.slug) {
        updatePayload.slug = projectData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
     }

    await projectDocRef.update(updatePayload);

    console.log('Project updated:', id);
    return NextResponse.json({ success: true, id, ...updatePayload }, { status: 200 });

  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 });
  }
}

// DELETE: Delete a project by ID
export async function DELETE(request: Request, context: RouteContext) {
  const { id } = context.params;
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const projectDocRef = firestore.collection('projects').doc(id);

    // Optional: Check if document exists before deleting
    const projectSnap = await projectDocRef.get();
    if (!projectSnap.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await projectDocRef.delete();

    console.log('Project deleted:', id);
    return NextResponse.json({ success: true, message: 'Project deleted successfully.' }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
  }
} 