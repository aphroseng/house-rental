// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // <--- Ongera iyi line yo gukora upload ya media

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcIE8ThwDimilH55X_Fx2FcXPmvMQU1QA",
  authDomain: "house-rental-rwanda.firebaseapp.com",
  projectId: "house-rental-rwanda",
  storageBucket: "house-rental-rwanda.firebasestorage.app",
  messagingSenderId: "255087236930",
  appId: "1:255087236930:web:13b553cbc7395118a69adb",
  measurementId: "G-GQLYWZKC03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Export db, auth na storage kugira ngo tuzazikoreshe ahandi muri app
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // <--- Iyi ni yo yakemuye ya error