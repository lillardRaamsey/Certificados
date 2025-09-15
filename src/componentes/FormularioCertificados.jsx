import React, { useState } from 'react';
import "../css/FormCertific.css";
import { useCertificados } from "../hooks/useCertificados"; // Importamos el hook

export default function CertificadoForm() {
  const { addCertificado } = useCertificados(); // obtenemos la función para agregar
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cargo, setCargo] = useState('');
  const [nota, setNota] = useState('');
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !cargo) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    // 🔹 Creamos el objeto con los datos
    const datosFormulario = {
      nombre,
      apellido,
      cargo,
      nota,
      archivoNombre: archivo ? archivo.name : null,
      creado: new Date()
    };

    try {
      // 🔹 Guardamos en Firebase en la colección "certificados"
      await addCertificado(datosFormulario);
      alert('Formulario enviado correctamente 🚀');
      handleReset();
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Hubo un error al enviar el formulario");
    }
  };

  const handleReset = () => {
    setNombre('');
    setApellido('');
    setCargo('');
    setNota('');
    setArchivo(null);
    document.getElementById('archivoInput').value = null;
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
              />
            </div>

            <div className="form-group">
              <label>Ingrese su/s apellido/s *</label>
              <input
                type="text"
                placeholder="Ej: Gutierrez"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>(Opcional) agregue una nota</label>
              <textarea
                placeholder="La nota puede contener información adicional relacionada..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="form-right">
            <label className="archivo-label">Seleccione un archivo…</label>
            <div className="archivo-drop">
              <input
                type="file"
                id="archivoInput"
                onChange={(e) => setArchivo(e.target.files[0])}
              />
              <i className="icono-subida">📁⬆️</i>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="button" className="btn btn-reset" onClick={handleReset}>
            ELIMINAR
          </button>
          <button type="submit" className="btn btn-submit">
            ENVIAR
          </button>
        </div>
      </form>
    </div>
  );
};
