import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/firebaseConfig';
import { authenticateSupabase, supabaseFileService } from '../Firebase/supabase';
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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Estados para la autenticación
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [supabaseAuth, setSupabaseAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user);
      setCargando(false);
      console.log('Usuario Firebase autenticado:', user?.uid);
      console.log('Email:', user?.email);

      // Si hay usuario de Firebase, autenticar en Supabase automáticamente
      if (user) {
        try {
          console.log('🔐 Iniciando autenticación en Supabase...');
          await authenticateSupabase();
          setSupabaseAuth(true);
          console.log('✅ Autenticado en Supabase correctamente');
        } catch (error) {
          console.error('❌ Error al autenticar en Supabase:', error);
          setSupabaseAuth(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIÓN 1: Verificar que el usuario esté autenticado en Firebase
    if (!usuario) {
      alert('Debes iniciar sesión primero');
      return;
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
        archivoNombre: null,
        archivoURL: null,
        archivoPath: null,
        userId: usuario.uid,
        userEmail: usuario.email,
        creado: new Date()
      };

      try {
        await addCertificado(datosFormulario);
        alert('Formulario enviado correctamente 🚀');
        handleReset();
      } catch (error) {
        console.error("Error al enviar:", error);
        alert("Hubo un error al enviar el formulario: " + error.message);
      }
      return;
    }

    // VALIDACIÓN 3: Verificar que el archivo sea válido
    if (!archivo.name || !archivo.type || archivo.size === undefined) {
      alert("El archivo seleccionado no es válido");
      return;
    }

    // VALIDACIÓN 4: Verificar tipos permitidos
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(archivo.type)) {
      alert('Solo se permiten archivos PDF, JPG y PNG');
      return;
    }

    // VALIDACIÓN 5: Verificar tamaño (50MB máximo)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (archivo.size > maxSize) {
      alert('El archivo no puede superar 50MB');
      return;
    }

    // CASO 2: SI hay archivo, subirlo a Supabase Storage
    setUploading(true);
    setUploadProgress(10); // Inicio
    
    try {
      console.log('📤 Iniciando proceso de subida...');
      
      // PASO 1: Asegurar autenticación en Supabase
      if (!supabaseAuth) {
        console.log('🔐 Re-autenticando en Supabase...');
        await authenticateSupabase();
        setSupabaseAuth(true);
      }
      setUploadProgress(20);

      // PASO 2: Subir archivo usando el servicio
      console.log('📤 Subiendo archivo a Supabase...');
      const resultado = await supabaseFileService.uploadFile(archivo, {
        folder: usuario.uid, // Organizar por usuario
        bucketName: 'certific-ar'
      });

      if (!resultado.success) {
        throw new Error(resultado.error || 'Error al subir archivo');
      }

      console.log('✅ Archivo subido exitosamente:', resultado.url);
      setUploadProgress(70);

      // PASO 3: Preparar datos para Firestore
      const datosFormulario = {
        nombre,
        apellido,
        nota,
        archivoNombre: archivo.name,
        archivoURL: resultado.url,
        archivoPath: resultado.path, // Guardar path para poder eliminar después
        archivoTipo: archivo.type,
        archivoTamanio: archivo.size,
        userId: usuario.uid,
        userEmail: usuario.email,
        creado: new Date()
      };

      console.log('💾 Guardando metadata en Firestore...');
      setUploadProgress(85);

      // PASO 4: Guardar en Firestore
      await addCertificado(datosFormulario);
      
      setUploadProgress(100);
      console.log('✅ Certificado guardado completamente');
      alert('Certificado enviado correctamente 🚀');
      handleReset();

    } catch (error) {
      console.error("❌ Error al subir archivo:", error);
      
      // Mensajes de error más específicos
      let errorMsg = "Error al subir el archivo: ";
      if (error.message.includes('row-level security')) {
        errorMsg += "Problema de permisos en Supabase. Verifica que la autenticación anónima esté habilitada y las políticas configuradas.";
      } else if (error.message.includes('JWT')) {
        errorMsg += "Problema de autenticación. Intenta recargar la página.";
      } else {
        errorMsg += error.message;
      }
      
      alert(errorMsg);
      setSupabaseAuth(false); // Forzar re-autenticación en el próximo intento
      
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleReset = () => {
    setNombre('');
    setApellido('');
    setNota('');
    setArchivo(null);
    setUploadProgress(0);
    const fileInput = document.getElementById('archivoInput');
    if (fileInput) fileInput.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📁 Archivo seleccionado:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
      setArchivo(file);
    } else {
      setArchivo(null);
    }
  };

  if (cargando) {
    return (
      <div className="certificado-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="certificado-container">
        <div className="auth-required">
          <h2>🔒 Acceso Restringido</h2>
          <p>Debes iniciar sesión para enviar certificados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="certificado-container">
      <form className="certificado-form" onSubmit={handleSubmit}>
        <div className="form-layout">
          <div className="form-left">
            <div className="form-group">
              <h1>Envío de certificados</h1>
              <div className="user-info">
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  👤 Usuario: {usuario.email}
                </p>
                {supabaseAuth && (
                  <p style={{ fontSize: '0.8em', color: '#28a745' }}>
                    ✅ Conectado a Supabase
                  </p>
                )}
              </div>
              <label>Ingrese su/s nombre/s *</label>
              <input
                type="text"
                placeholder="Ej: Pepe"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={uploading}
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
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={uploading}
              />
              <i className="icono-subida">📁⬆️</i>
              {archivo ? (
                <div className="archivo-info">
                  <p><strong>📄 {archivo.name}</strong></p>
                  <p>📦 Tamaño: {(archivo.size / 1024).toFixed(2)} KB</p>
                  <p>📋 Tipo: {archivo.type}</p>
                </div>
              ) : (
                <p className="archivo-placeholder">
                  Arrastra un archivo aquí o haz clic para seleccionar
                </p>
              )}
            </div>

            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p>
                  {uploadProgress < 30 && '🔐 Autenticando...'}
                  {uploadProgress >= 30 && uploadProgress < 70 && '📤 Subiendo archivo...'}
                  {uploadProgress >= 70 && uploadProgress < 90 && '💾 Guardando datos...'}
                  {uploadProgress >= 90 && '✅ Finalizando...'}
                  {' '}({uploadProgress}%)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="button-container">
          <button 
            type="button" 
            className="btn btn-reset" 
            onClick={handleReset}
            disabled={uploading}
          >
            {uploading ? '⏳ ESPERE...' : '🗑️ ELIMINAR'}
          </button>
          <button 
            type="submit" 
            className="btn btn-submit"
            disabled={uploading}
          >
            {uploading ? '⏳ ENVIANDO...' : '📤 ENVIAR'}
          </button>
        </div>
      </form>
    </div>
  );
}