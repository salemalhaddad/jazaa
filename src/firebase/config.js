import { initializeApp, getApps } from "firebase/app";
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
	apiKey: "AIzaSyCT4CdEbdwSG-eUN2oNAYbouTnk6831E_I",
	authDomain: "jazaa-16e92.firebaseapp.com",
	projectId: "jazaa-16e92",
	storageBucket: "jazaa-16e92.appspot.com",
	messagingSenderId: "122351131505",
	appId: "1:122351131505:web:179deae2a26df4e46ef4d0",
	measurementId: "G-K9BYGLENGH"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;
