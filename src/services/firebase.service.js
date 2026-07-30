import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAOqI3Iz4DOj8OxDjxgVOyUtlxhIAHHbQQ",
  authDomain: "minitweet-13068.firebaseapp.com",
  projectId: "minitweet-13068",
  storageBucket: "minitweet-13068.firebasestorage.app",
  messagingSenderId: "639253891557",
  appId: "1:639253891557:web:f6f60de1833a09e52b870c",
  measurementId: "G-G2TC0BQT38"
};

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
