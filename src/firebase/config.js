import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsVESwgtmqGI2lU9JxW_i-J5a7KC6PIYo",
  authDomain: "kkn-menyapa-komodo-2026.firebaseapp.com",
  projectId: "kkn-menyapa-komodo-2026",
  storageBucket: "kkn-menyapa-komodo-2026.firebasestorage.app",
  messagingSenderId: "790311416950",
  appId: "1:790311416950:web:009aea676ed6e6f082db57"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);