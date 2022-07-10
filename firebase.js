// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvCkfLjaSSt29S3MnrsbgDW5IvYFdUwFo",
  authDomain: "whatsapp-clone-13ff1.firebaseapp.com",
  projectId: "whatsapp-clone-13ff1",
  storageBucket: "whatsapp-clone-13ff1.appspot.com",
  messagingSenderId: "373601632024",
  appId: "1:373601632024:web:1478aab72be8fb01c5686d",
  measurementId: "G-T64CMT4FJH"
};

// Initialize Firebase
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp()

const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider()

export { db, auth, provider }