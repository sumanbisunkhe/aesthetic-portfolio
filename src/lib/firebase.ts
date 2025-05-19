import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAcuS5Xhko6J4MtsA-WLccJHs9qx35Lc7w",
  authDomain: "aesthetic-portfolio-eaedc.firebaseapp.com",
  projectId: "aesthetic-portfolio-eaedc",
  storageBucket: "aesthetic-portfolio-eaedc.firebasestorage.app",
  messagingSenderId: "523846822302",
  appId: "1:523846822302:web:17dff20237e9195711ce8f",
  measurementId: "G-1SSG3KLPG3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); 