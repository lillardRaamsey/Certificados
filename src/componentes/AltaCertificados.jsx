// src/componentes/AltaCertificados.jsx
import React, { useState } from "react";
import { useCertificados } from "../hooks/useCertificados";

const AltaDato = () => {
  const { addCertificado } = useCertificados();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCertificado({
      nombre,
      descripcion,
      creado: new Date(),
    });
    setNombre("");
    setDescripcion("");
  };

  return (
    <div>
      <h2>Agregar Certificado</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default AltaDato;
