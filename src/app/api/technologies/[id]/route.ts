import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { Technology } from '@/types/technology';
import { convertTimestampsToISO } from '@/lib/utils';

interface RouteContext {
  params: {
    id: string;
  };
}

// GET: Fetch a single technology by ID
export async function GET(request: Request, context: RouteContext) {
  const { id } = context.params;
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const techDocRef = firestore.collection('technologies').doc(id);
    const techSnap = await techDocRef.get();

    if (!techSnap.exists) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
    }

    const techData = { id: techSnap.id, ...techSnap.data() };
    return NextResponse.json(convertTimestampsToISO(techData), { status: 200 });

  } catch (error) {
    console.error(`Error fetching technology ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch technology.' }, { status: 500 });
  }
}

// PUT: Update an existing technology by ID
export async function PUT(request: Request, context: RouteContext) {
  const { id } = context.params;
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const techData = (await request.json()) as Partial<Omit<Technology, 'id' | 'createdAt' | 'updatedAt'>>;
    const techDocRef = firestore.collection('technologies').doc(id);

    const techSnap = await techDocRef.get();
    if (!techSnap.exists) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
    }

    // Validation
    if (techData.name !== undefined && techData.name.trim() === '') {
      return NextResponse.json({ error: 'Technology name cannot be empty' }, { status: 400 });
    }

    // Create update payload with proper type
    const updatePayload: Record<string, unknown> = { 
      updatedAt: Timestamp.now() 
    };
    
    if (techData.name !== undefined) updatePayload.name = techData.name.trim();
    // Add other fields here if needed in the future

    await techDocRef.update(updatePayload);

    const responseData = convertTimestampsToISO({ id, ...techSnap.data(), ...updatePayload });
    console.log('Technology updated:', id);
    return NextResponse.json({ success: true, ...responseData }, { status: 200 });

  } catch (error) {
    console.error(`Error updating technology ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update technology.' }, { status: 500 });
  }
}

// DELETE: Delete a technology by ID
export async function DELETE(request: Request, context: RouteContext) {
  const { id } = context.params;
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const techDocRef = firestore.collection('technologies').doc(id);

    const techSnap = await techDocRef.get();
    if (!techSnap.exists) {
      return NextResponse.json({ error: 'Technology not found' }, { status: 404 });
    }

    await techDocRef.delete();

    console.log('Technology deleted:', id);
    return NextResponse.json({ success: true, message: 'Technology deleted successfully.' }, { status: 200 });

  } catch (error) {
    console.error(`Error deleting technology ${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete technology.' }, { status: 500 });
  }
} 