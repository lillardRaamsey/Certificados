import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import "../css/formRegistro.css"

const FormRegistro = ({titulo}) =>{ 
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [contraseña2, setContraseña2] = useState('');
    const [email, setEmail] = useState('');
    const [DNI, setDNI] = useState('');
    const [telefono, setTelefono] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(contraseña !==contraseña2) {
            alert("las contraseñas debe coincidir");
            return;
        }
        navigate("/ingresar", {
            state: { nombre, apellido, contraseña, contraseña2, email, DNI}
        });
    };

    return (
        <div className="form-contenedor">
            <form onSubmit={handleSubmit} className="glass-form">
            <div>
            <h1>{titulo}</h1>
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
                    />
                </div>

                <div className="form-grupo">
                    <label>Confirme la contraseña:</label>
                    <input
                        type="password"
                        value={contraseña2}
                        onChange={(e) => setContraseña2(e.target.value)}
                        placeholder="***************"
                        required
                    />
                </div>

                <div className="form-grupo">
                    <label>Ingrese su DNI:</label>
                    <input
                        type="number"
                        value={DNI}
                        onChange={(e) => setDNI(e.target.value)}
                        placeholder="12345678"
                        required
                    />
                </div>
            </div>
            <div>
                <h2>Contactos:</h2>
            <div className="grid-contenedor-contacto">   
                <div className="form-grupo">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@gmail.com"
                    />
                </div>
                <div className="form-grupo">
                    <label>Telefono</label>
                    <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="ej: 2991234567"
                    />
                </div>
            </div> 
                    <button type="submit">Enviar</button>
                <div>
                    <h3>¿Ya Tienes una Cuenta? <a href="/ingresar">Inicia Sesión</a></h3>
                </div>
            </div>
        
            </div>
            </form>
        </div>
    );
};

export default FormRegistro;