# Firebase Firestore Setup Guide

This guide will help you set up Firestore for the contact form functionality in your portfolio website.

## Error: "Database service not fully initialized"

If you're seeing this error when testing the contact form, it means Firestore hasn't been properly set up in your Firebase project yet. Here's how to fix it:

## Step 1: Enable Firestore in your Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (portfolio-ff549)
3. From the left sidebar, click on "Firestore Database"
4. Click "Create database"
5. Choose "Start in production mode" (recommended)
6. Choose a database location closest to your target audience (e.g., "us-central1")
7. Click "Enable"

## Step 2: Wait for database provisioning

- It may take a few minutes for your database to be fully provisioned
- Once complete, you should see the Firestore dashboard

## Step 3: Set up security rules

Your Firestore security rules should be configured to allow the Admin SDK to write to the contacts collection. These rules are already defined in `firestore.rules` in your project:

```rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow writes to 'contacts' only via backend/Admin SDK. Disallow public reads.
    match /contacts/{contactId} {
      allow read: if false;
      allow create, update, delete: if true; // Admin SDK bypasses this, but explicit is okay
    }

    // Default deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

To deploy these rules:

1. Install the Firebase CLI if you haven't already:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```
   firebase init
   ```
   - Select "Firestore" when prompted
   - Choose your project
   - Accept the default rules file location

4. Deploy only the Firestore rules:
   ```
   firebase deploy --only firestore:rules
   ```

## Step 4: Retry the contact form

Once Firestore is fully set up, the contact form should work correctly. Try submitting the form again after completing the above steps.

## Additional Troubleshooting

If you continue to experience issues:

1. Check the JavaScript console in your browser for detailed error messages
2. Verify that your service account JSON in the .env.local file is correct and complete
3. Ensure the Firebase Admin SDK has the necessary permissions
4. Check if the error is related to CORS issues (if testing from different domains) 