// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';  // ✅ Import Auth module

const firebaseConfig = {
  apiKey: "AIzaSyCe0jp08JttYMpMb8Y30RhuxHl52kpSb0E",
  authDomain: "sejuk360-125cc.firebaseapp.com",
  projectId: "sejuk360-125cc",
  storageBucket: "sejuk360-125cc.firebasestorage.app",
  messagingSenderId: "510305936173",
  appId: "1:510305936173:web:b80e47dae3f18a4e10e9a4",
  measurementId: "G-EK7J60F2BE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // ✅ Initialize Auth

export { db, storage, auth }; // ✅ Export Auth
