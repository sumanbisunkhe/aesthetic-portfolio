import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  PhoneAuthProvider,
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
  type UserCredential
} from 'firebase/auth';
import { auth } from './firebase';

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const phoneProvider = new PhoneAuthProvider(auth);

// Email/Password Authentication
export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Google Authentication
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Facebook Authentication
export const signInWithFacebook = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, facebookProvider);
};

// Phone Authentication
export const setupRecaptcha = (elementId: string) => {
  return new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {},
  });
};

export const signInWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// Sign Out
export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Error handling helper
export const getAuthErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code.';
    case 'auth/invalid-verification-id':
      return 'Invalid verification ID.';
    default:
      return 'An error occurred during authentication.';
  }
}; 