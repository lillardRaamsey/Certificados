import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig'; // Ajusta la ruta según tu estructura

export function useCertificados() {
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Agregar un nuevo certificado
  const addCertificado = async (datos) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, 'certificados'), datos);
      console.log("Certificado creado con ID:", docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("Error al agregar certificado:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Obtener todos los certificados (para personal autorizado)
  const getCertificados = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'certificados'),
        orderBy('creado', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCertificados(docs);
      return docs;
    } catch (err) {
      console.error("Error al obtener certificados:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    certificados,
    loading,
    error,
    addCertificado,
    getCertificados
  };
}