import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import "../css/formingresar.css"

const Formingresar = ({titulo}) =>{ 
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/inicio-sesion", {
            state: { email, contraseña }
        });
    };

    return (
        <div className="form-contenedor">
            <form onSubmit={handleSubmit} className="glass-form">
            <div>
                <h1>Iniciar Sesión</h1>
                <div className="form-grupo">
                    <label>Ingresar Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        required
                    />
                </div>

                <div className="form-grupo">
                    <label>Ingresar Contraseña: </label>
                    <input
                        type="password"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        placeholder="***************"
                        required
                    />
                </div>
                <div>
                    <h3>¿No Tienes una Cuenta? <a href="/registro">Registrate</a></h3>
                </div>

            </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Formingresar;