import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Technology } from '@/types/technology';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { convertTimestampsToISO } from '@/lib/utils';

// GET: Fetch all technologies
export async function GET() {
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const techCol = firestore.collection('technologies');
    const q = techCol.orderBy('name', 'asc');
    const techSnapshot = await q.get();
    const techList = techSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const tech = { id: doc.id, ...doc.data() };
        return convertTimestampsToISO(tech);
    });
    return NextResponse.json(techList, { status: 200 });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return NextResponse.json({ error: 'Failed to fetch technologies.' }, { status: 500 });
  }
}

// POST: Create a new technology
export async function POST(request: Request) {
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const techData = (await request.json()) as Omit<Technology, 'id' | 'createdAt' | 'updatedAt'>;

    // Validation
    if (!techData.name || techData.name.trim() === '') {
      return NextResponse.json({ error: 'Technology name is required' }, { status: 400 });
    }

    const newTechnology = {
      name: techData.name.trim(),
      createdAt: Timestamp.now(),
    };

    const techCol = firestore.collection('technologies');
    const docRef = await techCol.add(newTechnology);

    const responseData = convertTimestampsToISO({ id: docRef.id, ...newTechnology });
    console.log('Technology created with ID:', docRef.id);
    return NextResponse.json({ success: true, ...responseData }, { status: 201 });

  } catch (error) {
    console.error('Error creating technology:', error);
    return NextResponse.json({ error: 'Failed to create technology.' }, { status: 500 });
  }
} 