import { initializeApp } from "firebase/app";
import { getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "process.env.YOUR_API_KEY",
	authDomain: "process.env.YOUR_AUTH_DOMAIN",
	projectId: "process.env.YOUR_PROJECT_ID",
	storageBucket: "process.env.YOUR_STORAGE_BUCKET",
	messagingSenderId: "process.env.YOUR_MESSAGING_SENDER_ID",
	appId: "process.env.YOUR_APP_ID"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider}
