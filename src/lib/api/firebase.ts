import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FS_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FS_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FS_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FS_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FS_MSG_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FS_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FS_MEASUREMENT_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
