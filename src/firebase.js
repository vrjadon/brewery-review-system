import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAKT_Aes0sEAmuDmKGqvO0Wnzw44bLbzA",
  authDomain: "assignment-project-59391.firebaseapp.com",
  projectId: "assignment-project-59391",
  storageBucket: "assignment-project-59391.appspot.com",
  messagingSenderId: "970160528324",
  appId: "1:970160528324:web:481878b9980267886d6291",
  measurementId: "G-JFK77D656V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
