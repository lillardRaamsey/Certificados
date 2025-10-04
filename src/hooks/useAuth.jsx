// src/hooks/useAuth.jsx
import { useState } from "react";
import { auth, db } from "../Firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registrarUsuario = async ({ email, password, nombre, apellido, telefono, rol }) => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Crear usuario en Firebase Auth
      console.log("Creando usuario en Auth...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario creado en Auth:", user.uid);

      // 2. Guardar datos adicionales en Firestore
      console.log("Guardando datos en Firestore...");
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        apellido,
        email,
        telefono: telefono || "",
        cargo: rol, // Se guarda como 'cargo' según tus reglas
        fechaRegistro: new Date().toISOString()
      });
      console.log("Datos guardados correctamente");

      return user;
    } catch (err) {
      console.error("Error completo:", err);
      
      // Mensajes de error en español
      let mensajeError = err.message;
      if (err.code === 'auth/email-already-in-use') {
        mensajeError = 'Este correo ya está registrado';
      } else if (err.code === 'auth/weak-password') {
        mensajeError = 'La contraseña debe tener al menos 6 caracteres';
      } else if (err.code === 'auth/invalid-email') {
        mensajeError = 'Correo electrónico inválido';
      } else if (err.code === 'permission-denied') {
        mensajeError = 'Error de permisos. Verifica las reglas de Firestore';
      }
      
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const iniciarSesion = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      
      let mensajeError = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        mensajeError = 'Usuario o contraseña incorrectos';
      } else if (err.code === 'auth/invalid-email') {
        mensajeError = 'Correo electrónico inválido';
      } else if (err.code === 'auth/invalid-credential') {
        mensajeError = 'Credenciales inválidas';
      }
      
      setError(mensajeError);
      throw new Error(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      throw err;
    }
  };

  return { registrarUsuario, iniciarSesion, cerrarSesion, loading, error };
}