// ══════════════════════════════════════════
//  FIREBASE CONFIG — replace with your own
//  from Firebase Console → Project Settings
// ══════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyBJgFsx0Aq63bbQ7mwfOI6_0pSWJkO8zp8",
  authDomain: "mamaspace-bf004.firebaseapp.com",
  projectId: "mamaspace-bf004",
  storageBucket: "mamaspace-bf004.firebasestorage.app",
  messagingSenderId: "520083469560",
  appId: "1:520083469560:web:d83cec2ce32ba0fa1bf70d"
};

// Default stubs so solo works even if Firebase is unconfigured
window._db = null;
window._firestoreOk = false;
window._fs = {};

// Load Firebase asynchronously — won't block the game at all
(async function(){
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc, deleteField, serverTimestamp, collection }
      = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const app = initializeApp(firebaseConfig);
    const db  = getFirestore(app);
    window._db = db;
    window._firestoreOk = true;
    window._fs = { doc, setDoc, getDoc, onSnapshot, updateDoc, deleteField, serverTimestamp, collection };
    console.log('Firebase ready ✓');
  } catch(e) {
    console.warn('Firebase not configured — multiplayer disabled:', e.message);
  }
})();
