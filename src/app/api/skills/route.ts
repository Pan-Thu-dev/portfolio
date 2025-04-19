import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Skill } from '@/types/skill';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { convertTimestampsToISO } from '@/lib/utils';

// GET: Fetch all skills
export async function GET() {
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const skillsCol = firestore.collection('skills');
    // Optional: Order by name or level
    const q = skillsCol.orderBy('name', 'asc');
    const skillSnapshot = await q.get();
    const skillsList = skillSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const skill = { id: doc.id, ...doc.data() };
      return convertTimestampsToISO(skill);
    });
    return NextResponse.json(skillsList, { status: 200 });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills.' }, { status: 500 });
  }
}

// POST: Create a new skill
export async function POST(request: Request) {
  if (!firestore) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  try {
    const skillData = (await request.json()) as Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;

    // Validation
    if (!skillData.name || skillData.name.trim() === '') {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
    }
    if (skillData.level === undefined || typeof skillData.level !== 'number' || skillData.level < 0 || skillData.level > 100) {
      return NextResponse.json({ error: 'Valid skill level (0-100) is required' }, { status: 400 });
    }

    const newSkill = {
      name: skillData.name.trim(),
      level: Math.round(skillData.level), // Ensure level is an integer
      createdAt: Timestamp.now(),
    };

    const skillsCol = firestore.collection('skills');
    const docRef = await skillsCol.add(newSkill);

    const responseData = convertTimestampsToISO({ id: docRef.id, ...newSkill });
    console.log('Skill created with ID:', docRef.id);
    return NextResponse.json({ success: true, ...responseData }, { status: 201 });

  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill.' }, { status: 500 });
  }
} 