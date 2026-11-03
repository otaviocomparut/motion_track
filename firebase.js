import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdDpOp5ZkJtS4HWPufWFRRimglk3ggnIY",
  authDomain: "motion-track-2b735.firebaseapp.com",
  projectId: "motion-track-2b735",
  storageBucket: "motion-track-2b735.firebasestorage.app",
  messagingSenderId: "1009987202023",
  appId: "1:1009987202023:web:d730589d31f59a0a5c2b42",
  measurementId: "G-0FN44ZPTQ7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export { app };

