import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/formRegistro.css";
import { useAuth } from "../hooks/useAuth"; // 👈 CAMBIO IMPORTANTE

const FormRegistro = ({ titulo, rol = "estudiante" }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [contraseña2, setContraseña2] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errorLocal, setErrorLocal] = useState(null);
  const navigate = useNavigate();

  const { registrarUsuario, loading, error } = useAuth(); // 👈 CAMBIO

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal(null);
    
    // Validaciones
    if (contraseña !== contraseña2) {
      setErrorLocal("Las contraseñas deben coincidir");
      return;
    }

    if (contraseña.length < 6) {
      setErrorLocal("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      console.log("Iniciando registro...");
      await registrarUsuario({
        email,
        password: contraseña,
        nombre,
        apellido,
        telefono,
        rol
      });

      alert("¡Registro exitoso! Bienvenido " + nombre);
      navigate("/ingresar");
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      // El error ya se muestra automáticamente
    }
  };

  const errorMostrado = errorLocal || error;

  return (
    <div className="form-contenedor">
      <form onSubmit={handleSubmit} className="glass-form">
        <div>
          <h1>{titulo}</h1>
          
          {errorMostrado && (
            <div style={{ 
              color: '#ff4444', 
              padding: '12px', 
              border: '2px solid #ff4444', 
              borderRadius: '8px',
              marginBottom: '20px',
              backgroundColor: 'rgba(255, 68, 68, 0.1)',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              ⚠️ {errorMostrado}
            </div>
          )}

          <h2>Datos:</h2>
          <div className="grid-contenedor-datos">
            <div className="form-grupo">
              <label>Ingrese su nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej: jose"
                required
                disabled={loading}
              />
            </div>

            <div className="form-grupo">
              <label>Ingrese su apellido:</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="ej: zeballos"
                required
                disabled={loading}
              />
            </div>

            <div className="form-grupo">
              <label>Ingrese una contraseña:</label>
              <input
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="***************"
                required
                minLength={6}
                disabled={loading}
              />
              <small style={{ color: '#888', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                Mínimo 6 caracteres
              </small>
            </div>

            <div className="form-grupo">
              <label>Confirme la contraseña:</label>
              <input
                type="password"
                value={contraseña2}
                onChange={(e) => setContraseña2(e.target.value)}
                placeholder="***************"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <br />
          
          <div className="form-grupo">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@gmail.com"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? "⏳ Registrando..." : "Enviar"}
          </button>
          
          <div>
            <h3>
              ¿Ya Tienes una Cuenta? <a href="/ingresar">Inicia Sesión</a>
            </h3>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormRegistro;