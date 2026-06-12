// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHMAZ9fJbqYx-14MAY5WwSFPfV5q6jXzs",
  authDomain: "fire-7eb23.firebaseapp.com",
  projectId: "fire-7eb23",
  storageBucket: "fire-7eb23.firebasestorage.app",
  messagingSenderId: "629103600698",
  appId: "1:629103600698:web:1e361a37cafbee53860103",
  measurementId: "G-WV2DX2NZGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
