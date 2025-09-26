// src/hooks/useUsuarios.jsx
import { useState, useEffect } from "react";
import { db } from "../Firebase/firebaseConfig";
import {
  collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc
} from "firebase/firestore";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = collection(db, "usuarios");

  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setUsuarios(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createUsuario = async (data) => {
    await addDoc(ref, data);
  };

  const updateUsuario = async (id, newData) => {
    const userDoc = doc(db, "usuarios", id);
    await updateDoc(userDoc, newData);
  };

  const deleteUsuario = async (id) => {
    const userDoc = doc(db, "usuarios", id);
    await deleteDoc(userDoc);
  };

  return { usuarios, loading, createUsuario, updateUsuario, deleteUsuario };
}
