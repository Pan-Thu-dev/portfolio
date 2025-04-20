import { NextRequest, NextResponse } from 'next/server';
import { firestore, ensureFirestoreSetup, authenticateAdminRequest } from '@/lib/firebase';
import { isAllowedAdmin } from '@/lib/firebase/permissions';

export async function GET(request: NextRequest) {
  try {
    // Get authentication header
    const authHeader = request.headers.get('Authorization');
    
    try {
      // Authenticate the request
      const decodedToken = await authenticateAdminRequest(authHeader);
      
      // Check if user has admin permissions
      if (!isAllowedAdmin(decodedToken.email || '')) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }
    } catch (error: Error | unknown) {
      console.error('Authentication failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    // Check if Firestore was initialized successfully
    if (!firestore) {
      console.error('Firestore is not initialized. Check Firebase Admin setup and environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' }, 
        { status: 500 }
      );
    }

    // Ensure Firestore is set up
    const firestoreReady = await ensureFirestoreSetup(firestore);
    if (!firestoreReady) {
      return NextResponse.json(
        { error: 'Database service not fully initialized.' }, 
        { status: 503 }
      );
    }

    // Get contact submissions, ordered by submission date (newest first)
    const contactsSnapshot = await firestore.collection('contacts')
      .orderBy('submittedAt', 'desc')
      .get();

    const contacts = contactsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firebase Timestamp to ISO string for JSON serialization
      submittedAt: doc.data().submittedAt?.toDate?.() 
        ? doc.data().submittedAt.toDate().toISOString() 
        : new Date().toISOString()
    }));

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' }, 
      { status: 500 }
    );
  }
} 