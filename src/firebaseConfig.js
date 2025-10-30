// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration (punyamu sendiri)
const firebaseConfig = {
  apiKey: "AIzaSyDyDJ6SuMKgt5AIvRbceJeBBAAPBq9fIbI",
  authDomain: "pmb-task-management.firebaseapp.com",
  projectId: "pmb-task-management",
  storageBucket: "pmb-task-management.firebasestorage.app",
  messagingSenderId: "806628994675",
  appId: "1:806628994675:web:2f13306c52f9cbf2cdc406",
  measurementId: "G-59ZHGZD12D"
};

// Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
