// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBHMAZ9fJbqYx-14MAY5WwSFPfV5q6jXzs",
  authDomain: "fire-7eb23.firebaseapp.com",
  projectId: "fire-7eb23",
  storageBucket: "fire-7eb23.firebasestorage.app",
  messagingSenderId: "629103600698",
  appId: "1:629103600698:web:1e361a37cafbee53860103"
};

// Default stubs (solo mode works even if Firebase fails)
window._db = null;
window._firestoreOk = false;
window._fs = {};

// Load Firebase
(async function initFirebase() {
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js");
    const { 
      getFirestore, 
      doc, 
      setDoc, 
      getDoc, 
      onSnapshot, 
      updateDoc, 
      deleteField, 
      serverTimestamp 
    } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    window._db = db;
    window._firestoreOk = true;
    window._fs = { doc, setDoc, getDoc, onSnapshot, updateDoc, deleteField, serverTimestamp };

    console.log("✅ Firebase initialized successfully (Modular)");
    
  } catch (e) {
    console.error("❌ Firebase failed to load:", e);
    window._firestoreOk = false;
  }
})();
