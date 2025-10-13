// src/Firebase/firebaseConfig.jsx

// Importar SDK base
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firestore
import { getFirestore } from "firebase/firestore";

// Storage
import { getStorage } from "firebase/storage";

// Auth
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence, 
  GoogleAuthProvider 
} from "firebase/auth";

// Configuración de Firebase
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

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Auth
export const auth = getAuth(app);

// Persistencia: mantiene sesión activa aunque se cierre la pestaña
setPersistence(auth, browserLocalPersistence);

// Proveedor de Google
export const googleProvider = new GoogleAuthProvider();

// Exportar app también como named export
export { app };

export default app;