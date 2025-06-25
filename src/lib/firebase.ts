import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAcuS5Xhko6J4MtsA-WLccJHs9qx35Lc7w",
  authDomain: "aesthetic-portfolio-eaedc.firebaseapp.com",
  projectId: "aesthetic-portfolio-eaedc",
  storageBucket: "aesthetic-portfolio-eaedc.firebasestorage.app",
  messagingSenderId: "523846822302",
  appId: "1:523846822302:web:17dff20237e9195711ce8f",
  measurementId: "G-1SSG3KLPG3"
};

// Validate required configuration
const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;
const missingConfig = requiredConfig.filter(key => !firebaseConfig[key]);

if (missingConfig.length > 0) {
  throw new Error(`Missing required Firebase configuration: ${missingConfig.join(', ')}`);
}

let app;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Enable offline persistence
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firebase persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
          console.warn('Firebase persistence not supported in this browser');
        }
      });

    // Initialize analytics
    analytics = getAnalytics(app);
  }

  // Connect to emulator if in development
  if (import.meta.env.DEV) {
    // Uncomment the following line if you're using Firebase emulator
    // connectFirestoreEmulator(db, 'localhost', 8080);
  }

  // Monitor auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is signed in:', user.uid);
    } else {
      console.log('User is signed out');
    }
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { auth, db, analytics }; 