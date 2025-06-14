import React, { useState } from 'react';

export default function CertificadoForm() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cargo, setCargo] = useState('');
  const [nota, setNota] = useState('');
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !cargo) {
      alert('Por favor, complete los campos obligatorios.');
      return;
    }

 // Creamos el objeto con los datos
    const datosFormulario = {
      nombre,
      apellido,
      cargo,
      nota,
      archivoNombre: archivo ? archivo.name : null
    };

    // Guardamos en localStorage (lo convertimos a JSON)
    localStorage.setItem('certificado', JSON.stringify(datosFormulario));

    alert('Formulario enviado correctamente.');
    handleReset();
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
    <div>
      <h1>ENTREGA DE CERTIFICADOS</h1>
      <p>Utilice el siguiente formulario para enviar su certificado médico.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Ingrese su/s nombre/s *</label><br />
          <input
            type="text"
            placeholder="Ej: Pepe"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Ingrese su/s apellido/s</label><br />
          <input
            type="text"
            placeholder="Ej: Gutierrez"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>

        <div>
          <label>Seleccione su cargo *</label><br />
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            required
          >
            <option value="">Ninguno seleccionado</option>
            <option value="Estudiante">Estudiante</option>
            <option value="Profesor">Profesor</option>
            <option value="Administrativo">Administrativo</option>
          </select>
        </div>

        <div>
          <label>Agregue una nota</label><br />
          <textarea
            placeholder="La nota puede contener información adicional relacionada..."
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            rows="3"
          ></textarea>
        </div>

        <div>
          <label>Seleccione un archivo</label><br />
          <input
            type="file"
            id="archivoInput"
            onChange={(e) => setArchivo(e.target.files[0])}
          />
        </div>

        <div>
          <button type="button" onClick={handleReset}>ELIMINAR</button>
          <button type="submit">ENVIAR</button>
        </div>
      </form>
    </div>
  );
}
