import React, { useState, useEffect } from "react";
import "../css/inicio.css";
import { useAuth } from "../context/AuthContex";
import { Link } from "react-router-dom";
import foto1 from "../img/epet20.png";
import foto2 from "../img/certificar2.png"; //imágenes de carrousel
import foto3 from "../img/Certificartexto.jpg";
import { db } from '../Firebase/firebaseConfig.jsx';
import { doc, getDoc } from 'firebase/firestore'; 

export default function Inicio() {
  const [index, setIndex] = useState(0);
  const images = [foto1, foto2, foto3];

  // 1. NUEVO: Estado para almacenar el rol del usuario de forma independiente.
  const [userRole, setUserRole] = useState(null); 
  const { user } = useAuth(); // Aquí obtenemos el objeto user de Firebase Auth

  // Funciones para flechas
  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  // 2. NUEVO: useEffect para cargar el rol desde Firestore/DB cuando el usuario cambie
  useEffect(() => {
    // Si hay un usuario logueado
    if (user) {
      // Si ya tienes el rol en el objeto user (ej: Custom Claims), úsalo:
      if (user.role) {
          setUserRole(user.role);
          return; // Salir si el rol ya está en el objeto user
      }

      // Si el rol se guarda en Firestore (ej: collection 'users' / doc 'uid')
      /* // Descomenta y ajusta si usas Firestore
      const fetchRole = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Asume que el campo se llama 'role' en tu documento de Firestore
            setUserRole(docSnap.data().role);
          } else {
            console.log("No se encontró el documento del usuario en la base de datos.");
            setUserRole("default"); // O cualquier rol por defecto
          }
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
          setUserRole("default");
        }
      };

      fetchRole();
      */

      // 🛑 TEMPORALMENTE (PARA PROBAR) 🛑
      // Si no estás usando Custom Claims ni Firestore, o sólo para probar que el botón funciona:
      // Si sabes el UID de un admin, puedes forzar la comprobación aquí (¡NO USAR EN PRODUCCIÓN!)
      // Ejemplo: if (user.uid === 'tu_uid_de_admin') { setUserRole('admin'); }
      
      // Si el rol se pasa *ya* en el contexto de autenticación, ¡lo guardamos!
      setUserRole(user.role); // ⬅️ Vuelve a intentar usar esta línea.

    } else {
      setUserRole(null); // No hay usuario, no hay rol
    }
  }, [user]); // Se ejecuta cuando el objeto 'user' cambia

  // 3. ACTUALIZADO: La comprobación ahora usa el nuevo estado userRole
  const isAdmin = userRole === "admin"; 
  const isLoading = user && userRole === null; // Estado de carga (opcional)

  // Si estás esperando la respuesta del servidor para el rol
  if (isLoading) {
      return <div className="loading">Cargando datos de usuario...</div>;
  }
  
  return (
    <div className="inicio-container">
      <div className="overlay">
        <h1 className="titulo">Bienvenido a Certific-AR</h1>

        {/* Carrusel omitido por brevedad... */}
        <div className="carousel">
          <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt={`Foto ${i + 1}`} />
            ))}
          </div>
        </div>
        <div className="arrow left" onClick={prevSlide}>❮</div>
        <div className="arrow right" onClick={nextSlide}>❯</div>

        {/* Lógica para botones según el estado de la sesión */}
        {user ? (
          <>
            <Link to="/envioCertificado">
              <div className="button">Certificados</div>
            </Link>

            {/* BOTÓN DE ADMINISTRACIÓN - AHORA USA userRole */}
            {isAdmin && (
              <Link to="/admin">
                <div className="button admin-button">Administración</div>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/ingresar">
              <div className="button">Ingresar</div>
            </Link>

            <div classname="registrarte">
              <h3>
                ¿No tenés una cuenta?
                <Link to="/registro"> Registrate</Link>
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}