// src/hooks/useCertificados.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";

export const useCertificados = () => {
  const [certificados, setCertificados] = useState([]);

  // Leer certificados
  const fetchCertificados = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "certificados"));
      const docs = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCertificados(docs);
    } catch (error) {
      console.error("Error al leer certificados:", error);
    }
  };

  // Agregar certificado
  const addCertificado = async (nuevo) => {
    try {
      await addDoc(collection(db, "certificados"), nuevo);
      fetchCertificados(); // refrescar lista
    } catch (error) {
      console.error("Error al agregar certificado:", error);
    }
  };

  // Actualizar certificado
  const updateCertificado = async (id, data) => {
    try {
      const ref = doc(db, "certificados", id);
      await updateDoc(ref, data);
      fetchCertificados();
    } catch (error) {
      console.error("Error al actualizar certificado:", error);
    }
  };

  // Eliminar certificado
  const deleteCertificado = async (id) => {
    try {
      const ref = doc(db, "certificados", id);
      await deleteDoc(ref);
      fetchCertificados();
    } catch (error) {
      console.error("Error al eliminar certificado:", error);
    }
  };

  useEffect(() => {
    fetchCertificados();
  }, []);

  return { certificados, addCertificado, updateCertificado, deleteCertificado };
};
