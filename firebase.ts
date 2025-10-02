import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// =================================================================================
// ACTION REQUIRED: Replace this with your actual Firebase project configuration.
// You can find this in your Firebase project console:
// Project Settings > General > Your apps > Web app > Firebase SDK snippet > Config
// =================================================================================
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};
// =================================================================================


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase services for use in other parts of the app
export const auth = getAuth(app);
export const db = getFirestore(app);
