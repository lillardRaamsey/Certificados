import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { storage, auth } from '../Firebase/firebaseConfig';
import "../css/FormCertific.css";
import { useCertificados } from "../hooks/useCertificados";

export default function CertificadoForm() {
  // Hook personalizado para manejar certificados en Firestore
  const { addCertificado } = useCertificados();
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nota, setNota] = useState('');
  const [archivo, setArchivo] = useState(null);
  
  // Estados para el proceso de subida
  const [uploading, setUploading] = useState(false); // Indica si se está subiendo un archivo
  const [uploadProgress, setUploadProgress] = useState(0); // Porcentaje de progreso (0-100)
  
  // Estados para la autenticación
  const [usuario, setUsuario] = useState(null); // Usuario autenticado actual
  const [cargando, setCargando] = useState(true); // Indica si Firebase Auth está inicializando

  // useEffect: Se ejecuta cuando el componente se monta
  // Escucha cambios en el estado de autenticación del usuario
  useEffect(() => {
    // onAuthStateChanged: Firebase notifica cada vez que cambia el estado de auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user); // Guarda el usuario (null si no está autenticado)
      setCargando(false); // Firebase ya terminó de cargar
      console.log('Usuario autenticado:', user?.uid);
      console.log('Email:', user?.email);
    });

    // Cleanup: Se ejecuta cuando el componente se desmonta
    // Cancela la suscripción para evitar memory leaks
    return () => unsubscribe();
  }, []); // Array vacío [] = solo se ejecuta una vez al montar

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene que el formulario recargue la página

    // VALIDACIÓN 1: Verificar que el usuario esté autenticado
    if (!usuario) {
      alert('Debes iniciar sesión primero');
      return; // Detiene la ejecución
    }

    // VALIDACIÓN 2: Campos obligatorios
    if (!nombre || !apellido) {
      alert("Por favor complete los campos obligatorios");
      return;
    }

    // CASO 1: Si NO hay archivo, solo guardar los datos del formulario
    if (!archivo) {
      const datosFormulario = {
        nombre,
        apellido,
        nota,
        archivoNombre: null, // Sin archivo
        archivoURL: null,    // Sin URL
        userId: usuario.uid,       // ID del usuario autenticado
        userEmail: usuario.email,  // Email del usuario
        creado: new Date()         // Timestamp de creación
      };

      try {
        // Guarda en Firestore usando el hook personalizado
        await addCertificado(datosFormulario);
        alert('Formulario enviado correctamente 🚀');
        handleReset(); // Limpia el formulario
      } catch (error) {
        console.error("Error al enviar:", error);
        alert("Hubo un error al enviar el formulario: " + error.message);
      }
      return; // Sale de la función
    }

    // VALIDACIÓN 3: Verificar que el archivo sea válido
    if (!archivo.name || !archivo.type || archivo.size === undefined) {
      alert("El archivo seleccionado no es válido");
      return;
    }

    // CASO 2: SI hay archivo, subirlo a Storage
    setUploading(true); // Bloquea el formulario mientras sube
    
    try {
      // Genera un nombre único para el archivo usando timestamp
      const timestamp = Date.now(); // Ej: 1760844326386
      // Limpia caracteres especiales del nombre original
      const nombreArchivo = archivo.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      // Crea la referencia en Storage: certificados/timestamp_nombrearchivo.pdf
      const storageRef = ref(storage, `certificados/${timestamp}_${nombreArchivo}`);
      
      console.log('Iniciando subida a:', storageRef.fullPath);
      
      // uploadBytesResumable: Permite monitorear el progreso de subida
      const uploadTask = uploadBytesResumable(storageRef, archivo);

      // Monitorea el progreso de la subida
      uploadTask.on('state_changed',
        // 1. PROGRESO: Se ejecuta cada vez que sube una parte del archivo
        (snapshot) => {
          // Calcula el porcentaje (bytes subidos / bytes totales * 100)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress)); // Actualiza la barra de progreso
          console.log('Progreso:', Math.round(progress) + '%');
        },
        
        // 2. ERROR: Se ejecuta si hay un problema durante la subida
        (error) => {
          console.error("Error al subir archivo:", error);
          console.error("Código de error:", error.code); // Ej: storage/unauthorized
          console.error("Mensaje:", error.message);
          alert("Error al subir el archivo: " + error.message);
          setUploading(false); // Desbloquea el formulario
          setUploadProgress(0); // Resetea el progreso
        },
        
        // 3. COMPLETADO: Se ejecuta cuando el archivo se subió exitosamente
        async () => {
          try {
            // Obtiene la URL pública del archivo subido
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Archivo subido. URL:', downloadURL);
            
            // Prepara los datos completos para guardar en Firestore
            const datosFormulario = {
              nombre,
              apellido,
              nota,
              archivoNombre: archivo.name,    // Nombre original
              archivoURL: downloadURL,        // URL de Firebase Storage
              archivoTipo: archivo.type,      // Ej: application/pdf
              archivoTamanio: archivo.size,   // Tamaño en bytes
              userId: usuario.uid,            // ID del usuario
              userEmail: usuario.email,       // Email del usuario
              creado: new Date()              // Timestamp
            };

            // Guarda todo en Firestore
            await addCertificado(datosFormulario);
            alert('Certificado enviado correctamente 🚀');
            handleReset(); // Limpia el formulario
            setUploadProgress(0); // Resetea progreso
          } catch (error) {
            console.error("Error al guardar en Firestore:", error);
            alert("El archivo se subió pero hubo un error al guardar los datos: " + error.message);
          } finally {
            // finally: Se ejecuta siempre, haya error o no
            setUploading(false); // Desbloquea el formulario
          }
        }
      );

    } catch (error) {
      // Captura errores generales (no relacionados con la subida)
      console.error("Error general:", error);
      alert("Hubo un error al procesar el archivo: " + error.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Limpia todos los campos del formulario
  const handleReset = () => {
    setNombre('');
    setApellido('');
    setNota('');
    setArchivo(null);
    setUploadProgress(0);
    // Limpia también el input file del DOM
    const fileInput = document.getElementById('archivoInput');
    if (fileInput) fileInput.value = '';
  };

  // Maneja la selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]; // ?. = optional chaining (evita error si es undefined)
    if (file) {
      setArchivo(file); // Guarda el archivo en el estado
    } else {
      setArchivo(null); // Si se cancela la selección
    }
  };

  // RENDERIZADO CONDICIONAL 1: Mientras Firebase Auth se inicializa
  if (cargando) {
    return (
      <div className="certificado-container">
        <p>Cargando...</p>
      </div>
    );
  }

  // RENDERIZADO CONDICIONAL 2: Si no hay usuario autenticado
  if (!usuario) {
    return (
      <div className="certificado-container">
        <p>Debes iniciar sesión para enviar certificados</p>
      </div>
    );
  }

  // RENDERIZADO PRINCIPAL: Usuario autenticado, muestra el formulario
  return (
    <div className="certificado-container">
      <form className="certificado-form" onSubmit={handleSubmit}>
        <div className="form-layout">
          <div className="form-left">
            <div className="form-group">
              <h1>Envío de certificados</h1>
              {/* Muestra el email del usuario actual */}
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                Usuario: {usuario.email}
              </p>
              <label>Ingrese su/s nombre/s *</label>
              <input
                type="text"
                placeholder="Ej: Pepe"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={uploading} // Deshabilitado mientras sube el archivo
              />
            </div>

            <div className="form-group">
              <label>Ingrese su/s apellido/s *</label>
              <input
                type="text"
                placeholder="Ej: Gutierrez"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                disabled={uploading}
              />
            </div>

            <div className="form-group">
              <label>(Opcional) agregue una nota</label>
              <textarea
                placeholder="La nota puede contener información adicional relacionada..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows="3"
                disabled={uploading}
              ></textarea>
            </div>
          </div>

          <div className="form-right">
            <label className="archivo-label">Seleccione un archivo…</label>
            <div className="archivo-drop">
              <input
                type="file"
                id="archivoInput"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" // Solo acepta estos tipos
                disabled={uploading}
              />
              <i className="icono-subida">📁⬆️</i>
              {/* Muestra info del archivo si hay uno seleccionado */}
              {archivo && (
                <div>
                  <p>Archivo seleccionado: {archivo.name}</p>
                  <p>Tamaño: {(archivo.size / 1024).toFixed(2)} KB</p>
                </div>
              )}
            </div>

            {/* Barra de progreso: solo se muestra mientras sube */}
            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }} // Ancho dinámico según %
                  ></div>
                </div>
                <p>Subiendo: {uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>

        <div className="button-container">
          {/* Botón para limpiar el formulario */}
          <button 
            type="button" 
            className="btn btn-reset" 
            onClick={handleReset}
            disabled={uploading} // No se puede limpiar mientras sube
          >
            ELIMINAR
          </button>
          {/* Botón para enviar el formulario */}
          <button 
            type="submit" 
            className="btn btn-submit"
            disabled={uploading} // No se puede enviar mientras ya está subiendo
          >
            {uploading ? 'ENVIANDO...' : 'ENVIAR'} {/* Texto dinámico */}
          </button>
        </div>
      </form>
    </div>
  );
}