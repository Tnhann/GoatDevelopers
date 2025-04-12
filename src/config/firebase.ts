import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBDW6bpDkpi_VoqHOunMvt9zm_yPs_Y3g",
  authDomain: "goatdevelopersmobile.firebaseapp.com",
  projectId: "goatdevelopersmobile",
  storageBucket: "goatdevelopersmobile.firebasestorage.app",
  messagingSenderId: "692699347598",
  appId: "1:692699347598:web:c2648265fbbc46f18727df",
  measurementId: "G-J9C59DDGBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 