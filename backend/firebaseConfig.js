// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "smart-beach-safety-system.firebaseapp.com",
  projectId: "smart-beach-safety-system",
  storageBucket: "smart-beach-safety-system.firebasestorage.app",
  messagingSenderId: "1039005928182",
  appId: "1:1039005928182:web:4968d20afc8f034215bad7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize a database and export
export const db = getFirestore(app);
