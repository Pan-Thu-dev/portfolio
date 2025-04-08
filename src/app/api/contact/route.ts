import { NextResponse } from 'next/server';
import { firestore, ensureFirestoreSetup } from '@/lib/firebaseAdmin';
import { sendContactNotification } from '@/lib/emailService';

export async function POST(request: Request) {
  // Check if Firestore was initialized successfully
  if (!firestore) {
    console.error('Firestore is not initialized. Check Firebase Admin setup and environment variables.');
    return NextResponse.json(
      { error: 'Server configuration error. Please try again later.' }, 
      { status: 500 }
    );
  }

  try {
    const { name, email, message } = await request.json();

    // Basic validation
    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    try {
      // First check if Firestore is properly set up
      const firestoreReady = await ensureFirestoreSetup(firestore);
      if (!firestoreReady) {
        return NextResponse.json(
          { error: 'Database service not fully initialized. Please enable Firestore in the Firebase Console and try again later.' }, 
          { status: 503 } // Service Unavailable
        );
      }

      // Prepare contact data with timestamp
      const submittedAt = new Date();
      const contactData = {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        submittedAt,
        status: 'new',
      };

      // Get a reference to contacts collection
      const contactsRef = firestore.collection('contacts');
      
      // Add the document to Firestore
      const docRef = await contactsRef.add(contactData);
      console.log('Contact form submission saved with ID:', docRef.id);
      
      // Send email notification (don't await to prevent slowdown)
      sendContactNotification({
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
        submittedAt
      }).catch(err => {
        console.error('Email notification failed, but form was saved:', err);
      });
      
      return NextResponse.json(
        { success: true, message: 'Message sent successfully!' }, 
        { status: 200 }
      );
    } catch (firestoreError: any) { // Type as any since Firebase errors have no specific type export
      console.error('Firestore operation failed:', firestoreError);
      
      // Handle database not initialized yet
      if (firestoreError.code === 5) { // NOT_FOUND error
        return NextResponse.json(
          { error: 'Database service not fully initialized. Please enable Firestore in the Firebase Console and try again later.' }, 
          { status: 503 } // Service Unavailable
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to save your message. Please try again later.' }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to process your request.', details: errorMessage }, 
      { status: 500 }
    );
  }
} 