// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhJyplxgk_mZsefirrfjf6zzXt-cRAGFg",
  authDomain: "inventory-management-a5242.firebaseapp.com",
  projectId: "inventory-management-a5242",
  storageBucket: "inventory-management-a5242.appspot.com",
  messagingSenderId: "474679491385",
  appId: "1:474679491385:web:019d01438f0b489585c6e8",
  measurementId: "G-H83C52G2TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}