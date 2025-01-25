// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq3gbd7gKv2dZ4QZENgZFEaxap2-FmT88",
  authDomain: "myshopfirebase-bda42.firebaseapp.com",
  projectId: "myshopfirebase-bda42",
  storageBucket: "myshopfirebase-bda42.firebasestorage.app",
  messagingSenderId: "763268628777",
  appId: "1:763268628777:web:d0046954b40c2ba5ba3738",
  measurementId: "G-C0DMZ6MW84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
