import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log Firebase configuration (for debugging)
console.log('🔥 Firebase Config Initialization:');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...');

// Validate that all required config values exist
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter((field) => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('❌ Firebase Config Error - Missing fields:', missingFields);
  console.error('Please verify .env.local file has NEXT_PUBLIC_FIREBASE_* variables');
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

// Initialize Auth and export
export const auth = getAuth(app);
console.log('✅ Auth initialized');

// Initialize Firestore and export
export const db = getFirestore(app);
console.log('✅ Firestore initialized');

export default app;
