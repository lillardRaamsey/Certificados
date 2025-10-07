import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/tabla.css";
import { useUsuarios } from "../hooks/useUsuarios";
import { useCertificados } from "../hooks/useCertificados";

export default function CertificadoForm() {
  return (
    <div className="container">
      <h1>Usuarios Registrados</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.edad}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
