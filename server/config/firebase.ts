import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { env } from "./env";

const firebaseConfig = {
    apiKey: env.get("API_KEY"),
    authDomain: env.get("AUTH_DOMAIN"),
    projectId: env.get("PROJECT_ID"),
    storageBucket: env.get("STORAGE_BUCKET"),
    messagingSenderId: env.get("MESSAGING_SENDER_ID"),
    appId: env.get("APP_ID"),
};

export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);
export const auth = getAuth(firebase);
