
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCVVnXzwKxu_kBoNlEKjluBQPMpJRYPHbQ",
  authDomain: "certific-ar.firebaseapp.com",
  projectId: "certific-ar",
  storageBucket: "certific-ar.firebasestorage.app",
  messagingSenderId: "224819505288",
  appId: "1:224819505288:web:1f60570e53678c9872173d",
  measurementId: "G-ZH89WEE13C"
};


const app = initializeApp(firebaseConfig);


const analytics = getAnalytics(app);


export const auth = getAuth(app);


export const db = getFirestore(app);


export const storage = getStorage(app);


export const googleProvider = new GoogleAuthProvider();


googleProvider.setCustomParameters({
  prompt: 'select_account'
});


setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error al configurar persistencia:", error);
});


export { app };
export default app;