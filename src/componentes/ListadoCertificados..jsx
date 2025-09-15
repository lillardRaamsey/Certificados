// src/componentes/ListadoCertificadosos.jsx
import React from "react";
import { useCertificados } from "../hooks/useCertificados";

const ListadoDatos = () => {
  const { certificados, deleteCertificado } = useCertificados();

  return (
    <div>
      <h2>Listado de Certificados</h2>
      <ul>
        {certificados.map((dato) => (
          <li key={dato.id}>
            {dato.nombre} - {dato.descripcion}
            <button onClick={() => deleteCertificado(dato.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListadoDatos;
