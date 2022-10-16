import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBp_7V3hGLr8WlzTcG6HskAY8R1lbpqP5w',
  authDomain: 'northern-kaffeine.firebaseapp.com',
  projectId: 'northern-kaffeine',
  storageBucket: 'northern-kaffeine.appspot.com',
  messagingSenderId: '396885292701',
  appId: '1:396885292701:web:f49474c0eaaff49485c674',
  measurementId: 'G-6XJT6S2RDE',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
