import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  RecaptchaVerifier 
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAR6oIt2NBoG2xV2MGXnyIp5M3ufo_5UOM",
  authDomain: "arabtimesweb.firebaseapp.com",
  projectId: "arabtimesweb",
  storageBucket: "arabtimesweb.firebasestorage.app",
  messagingSenderId: "516248355962",
  appId: "1:516248355962:web:2dc9c8c680f73138bfa7c3",
  measurementId: "G-H78QFLCYKE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Try to initialize analytics if supported in window
let analytics;
try {
  analytics = getAnalytics(app);
} catch {
  // Ignore analytics failure in some environments
}
export { analytics };

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export { RecaptchaVerifier };

