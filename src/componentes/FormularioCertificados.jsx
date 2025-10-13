import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { storage } from '../Firebase/firebaseConfig';
import "../css/FormCertific.css";
import { useCertificados } from "../hooks/useCertificados";

export default function CertificadoForm() {

  console.log('Storage:', storage); // Añade esto

  const { addCertificado } = useCertificados();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nota, setNota] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!nombre || !apellido) {
      alert("Por favor complete los campos obligatorios");
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Debes iniciar sesión para enviar certificados");
      return;
    }

    // Si no hay archivo, enviar solo los datos del formulario
    if (!archivo) {
      const datosFormulario = {
        nombre,
        apellido,
        nota,
        archivoNombre: null,
        archivoURL: null,
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

    // Validar que el archivo tenga las propiedades necesarias
    if (!archivo.name || !archivo.type || archivo.size === undefined) {
      alert("El archivo seleccionado no es válido");
      return;
    }

    setUploading(true);
    
    try {
      const timestamp = Date.now();
      // Sanitizar el nombre del archivo
      const nombreArchivo = archivo.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageRef = ref(storage, `certificados/${timestamp}_${nombreArchivo}`);
      
      const uploadTask = uploadBytesResumable(storageRef, archivo);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error("Error al subir archivo:", error);
          alert("Error al subir el archivo: " + error.message);
          setUploading(false);
          setUploadProgress(0);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            const datosFormulario = {
              nombre,
              apellido,
              nota,
              archivoNombre: archivo.name,
              archivoURL: downloadURL,
              archivoTipo: archivo.type,
              archivoTamanio: archivo.size,
              creado: new Date()
            };

            await addCertificado(datosFormulario);
            alert('Certificado enviado correctamente 🚀');
            handleReset();
            setUploadProgress(0);
          } catch (error) {
            console.error("Error al guardar en Firestore:", error);
            alert("El archivo se subió pero hubo un error al guardar los datos: " + error.message);
          } finally {
            setUploading(false);
          }
        }
      );

    } catch (error) {
      console.error("Error general:", error);
      alert("Hubo un error al procesar el archivo: " + error.message);
      setUploading(false);
      setUploadProgress(0);
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
      setArchivo(file);
    } else {
      setArchivo(null);
    }
  };

  return (
    <div className="certificado-container">
      <form className="certificado-form" onSubmit={handleSubmit}>
        <div className="form-layout">
          <div className="form-left">
            <div className="form-group">
              <h1>Envío de certificados</h1>
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
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                disabled={uploading}
              />
              <i className="icono-subida">📁⬆️</i>
              {archivo && (
                <div>
                  <p>Archivo seleccionado: {archivo.name}</p>
                  <p>Tamaño: {(archivo.size / 1024).toFixed(2)} KB</p>
                </div>
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
                <p>Subiendo: {uploadProgress}%</p>
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
            ELIMINAR
          </button>
          <button 
            type="submit" 
            className="btn btn-submit"
            disabled={uploading}
          >
            {uploading ? 'ENVIANDO...' : 'ENVIAR'}
          </button>
        </div>
      </form>
    </div>
  );
}