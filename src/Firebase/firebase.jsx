// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVVnXzwKxu_kBoNlEKjluBQPMpJRYPHbQ",
  authDomain: "certific-ar.firebaseapp.com",
  projectId: "certific-ar",
  storageBucket: "certific-ar.firebasestorage.app",
  messagingSenderId: "224819505288",
  appId: "1:224819505288:web:1f60570e53678c9872173d",
  measurementId: "G-ZH89WEE13C"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Analytics (opcional)
const analytics = getAnalytics(app);

// Exportar Firestore
export const db = getFirestore(app);

// Exportar Auth
export const auth = getAuth(app);

// Persistencia: mantiene sesión activa
setPersistence(auth, browserLocalPersistence);

// Proveedor de Google
export const googleProvider = new GoogleAuthProvider();
