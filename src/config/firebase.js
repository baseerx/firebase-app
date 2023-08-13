// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCy55YG9j15-KX_DOJAuvM30Aiacg-Tm2A",
  authDomain: "fir-app-6a8b6.firebaseapp.com",
  projectId: "fir-app-6a8b6",
  storageBucket: "fir-app-6a8b6.appspot.com",
  messagingSenderId: "977874153770",
  appId: "1:977874153770:web:fa884aa7b984caffc6ae53",
  measurementId: "G-1DHDEJ1SXQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const googleProvider=new GoogleAuthProvider();
export const db=getFirestore(app);