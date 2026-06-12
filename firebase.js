// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBHMAZ9fJbqYx-14MAY5WwSFPfV5q6jXzs",
  authDomain: "fire-7eb23.firebaseapp.com",
  projectId: "fire-7eb23",
  storageBucket: "fire-7eb23.firebasestorage.app",
  messagingSenderId: "629103600698",
  appId: "1:629103600698:web:1e361a37cafbee53860103"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

window._db = db;
window._firestoreOk = true;

window._fs = {
  doc: firebase.firestore().doc,
  setDoc: firebase.firestore().setDoc,
  getDoc: firebase.firestore().getDoc,
  onSnapshot: firebase.firestore().onSnapshot,
  updateDoc: firebase.firestore().updateDoc,
  deleteField: firebase.firestore.FieldValue.delete,
  serverTimestamp: () => firebase.firestore.FieldValue.serverTimestamp()
};

console.log("✅ Firebase initialized successfully");
