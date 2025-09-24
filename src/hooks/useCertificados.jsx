// src/hooks/useCertificados.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";

export const useCertificados = () => {
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(false);

  // Leer certificados
  const fetchCertificados = async () => {
    try {
      setLoading(true);
      console.log("🔍 Intentando leer certificados...");
      const querySnapshot = await getDocs(collection(db, "certificados"));
      const docs = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCertificados(docs);
      console.log("✅ Certificados leídos:", docs.length);
    } catch (error) {
      console.error("❌ Error al leer certificados:", error);
      console.error("Detalles del error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Agregar certificado
  const addCertificado = async (nuevo) => {
    try {
      setLoading(true);
      console.log("📝 Intentando agregar certificado:", nuevo);
      
      // Verificar que db esté definido
      if (!db) {
        throw new Error("Base de datos no inicializada");
      }

      const docRef = await addDoc(collection(db, "certificados"), nuevo);
      console.log("✅ Certificado agregado con ID:", docRef.id);
      
      await fetchCertificados(); // refrescar lista
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("❌ Error al agregar certificado:", error);
      console.error("Código de error:", error.code);
      console.error("Mensaje:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar certificado
  const updateCertificado = async (id, data) => {
    try {
      setLoading(true);
      console.log("🔄 Actualizando certificado:", id, data);
      const ref = doc(db, "certificados", id);
      await updateDoc(ref, data);
      console.log("✅ Certificado actualizado");
      fetchCertificados();
      return { success: true };
    } catch (error) {
      console.error("❌ Error al actualizar certificado:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar certificado
  const deleteCertificado = async (id) => {
    try {
      setLoading(true);
      console.log("🗑️ Eliminando certificado:", id);
      const ref = doc(db, "certificados", id);
      await deleteDoc(ref);
      console.log("✅ Certificado eliminado");
      fetchCertificados();
      return { success: true };
    } catch (error) {
      console.error("❌ Error al eliminar certificado:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificados();
  }, []);

  return { 
    certificados, 
    addCertificado, 
    updateCertificado, 
    deleteCertificado,
    loading 
  };
};