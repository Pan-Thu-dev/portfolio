import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Skill } from '@/types/skill';
import { convertTimestampsToISO } from '@/lib/utils';

interface RouteContext {
  params: {
    id: string;
  };
}

// GET: Fetch a single skill by ID
export async function GET(request: Request, context: RouteContext) {
  const { id } = context.params;
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const skillDocRef = firestore.collection('skills').doc(id);
    const skillSnap = await skillDocRef.get();

    if (!skillSnap.exists) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const skillData = { id: skillSnap.id, ...skillSnap.data() };
    return NextResponse.json(convertTimestampsToISO(skillData), { status: 200 });

  } catch (error) {
    console.error(`Error fetching skill ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch skill.' }, { status: 500 });
  }
}

// PUT: Update an existing skill by ID
export async function PUT(request: Request, context: RouteContext) {
  const { id } = context.params;
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const skillData = (await request.json()) as Partial<Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>>;
    const skillDocRef = firestore.collection('skills').doc(id);

    // Check if document exists
    const skillSnap = await skillDocRef.get();
    if (!skillSnap.exists) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Validation
    if (skillData.name !== undefined && skillData.name.trim() === '') {
      return NextResponse.json({ error: 'Skill name cannot be empty' }, { status: 400 });
    }
    if (skillData.level !== undefined && (typeof skillData.level !== 'number' || skillData.level < 0 || skillData.level > 100)) {
      return NextResponse.json({ error: 'Valid skill level (0-100) is required' }, { status: 400 });
    }

    // Create update payload with proper type
    const updatePayload: Record<string, unknown> = { 
      updatedAt: Timestamp.now() 
    };
    
    if (skillData.name !== undefined) updatePayload.name = skillData.name.trim();
    if (skillData.level !== undefined) updatePayload.level = Math.round(skillData.level);

    await skillDocRef.update(updatePayload);

    const responseData = convertTimestampsToISO({ id, ...skillSnap.data(), ...updatePayload });
    console.log('Skill updated:', id);
    return NextResponse.json({ success: true, ...responseData }, { status: 200 });

  } catch (error) {
    console.error(`Error updating skill ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update skill.' }, { status: 500 });
  }
}

// DELETE: Delete a skill by ID
export async function DELETE(request: Request, context: RouteContext) {
  const { id } = context.params;
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const skillDocRef = firestore.collection('skills').doc(id);

    // Optional: Check existence before deleting
    const skillSnap = await skillDocRef.get();
    if (!skillSnap.exists) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await skillDocRef.delete();

    console.log('Skill deleted:', id);
    return NextResponse.json({ success: true, message: 'Skill deleted successfully.' }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting skill ${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete skill.' }, { status: 500 });
  }
} 