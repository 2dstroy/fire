// ══════════════════════════════════════════
//  FIREBASE CONFIG — replace with your own
//  from Firebase Console → Project Settings
// ══════════════════════════════════════════
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
