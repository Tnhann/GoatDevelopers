import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDBDW6bpDkpi_VoqHOunMvt9zm_yPs_Y3g",
  authDomain: "goatdevelopersmobile.firebaseapp.com",
  projectId: "goatdevelopersmobile",
  storageBucket: "goatdevelopersmobile.firebasestorage.app",
  messagingSenderId: "692699347598",
  appId: "1:692699347598:web:c2648265fbbc46f18727df",
  measurementId: "G-J9C59DDGBJ",
  databaseURL: "https://goatdevelopersmobile-default-rtdb.firebaseio.com" // Realtime Database URL eklendi
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const realtimeDb = getDatabase(app, "https://goatdevelopersmobile-default-rtdb.firebaseio.com/");
export const db = firestore; // Geriye dönük uyumluluk için

export default app;