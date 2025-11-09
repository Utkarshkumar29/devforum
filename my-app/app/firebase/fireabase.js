// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import {getAuth,GoogleAuthProvider,signInWithPopup, GithubAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4xj3LrXMOfUZfytFZA3RILrZ0lgEfF3A",
  authDomain: "chatrooms-2f5bc.firebaseapp.com",
  projectId: "chatrooms-2f5bc",
  storageBucket: "chatrooms-2f5bc.appspot.com",
  messagingSenderId: "998170279518",
  appId: "1:998170279518:web:f7a302a4da160f15e5becf",
  measurementId: "G-26HY49WL31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage=getStorage(app)

const auth=getAuth()
const googleProvider=new GoogleAuthProvider()
const githubProvider=new GithubAuthProvider()

export { storage, auth, googleProvider, githubProvider, signInWithPopup }