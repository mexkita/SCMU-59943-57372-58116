import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDK84SNHv4nh_T6EupYvcCA0cPMWH2hT7o",
    authDomain: "parking-41f39.firebaseapp.com",
    databaseURL: "https://parking-41f39-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "parking-41f39",
    storageBucket: "parking-41f39.appspot.com",
    messagingSenderId: "801427461156",
    appId: "1:801427461156:web:499064f33edf64df4a74b1",
    measurementId: "G-M7R8ZNBP52"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);