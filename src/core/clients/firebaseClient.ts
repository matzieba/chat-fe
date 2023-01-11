import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  signInWithPopup,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  sendPasswordResetEmail,
  AuthProvider,
  OAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_CVT_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_CVT_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_CVT_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_CVT_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_CVT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_CVT_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_CVT_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_CVT_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const firebaseClient = {
  getAuth,
  auth: {
    createUserWithEmailAndPassword: (email: string, password: string) => createUserWithEmailAndPassword(getAuth(), email, password),
    signInWithRedirect: (provider: AuthProvider) => signInWithRedirect(getAuth(), provider),
    signInWithPopup: (provider: AuthProvider) => signInWithPopup(getAuth(), provider),
    signInWithEmailAndPassword: (email: string, password: string) => signInWithEmailAndPassword(getAuth(), email, password),
    signInWithCustomToken: (token: string) => signInWithCustomToken(getAuth(), token),
    sendPasswordResetEmail: (email: string) => sendPasswordResetEmail(getAuth(), email),
    signOut: () => signOut(getAuth()),
    OAuthProvider,
    GoogleAuthProvider,
    TwitterAuthProvider,
    FacebookAuthProvider,
  },
};
