import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import "../css/formingresar.css"
import appFirebase from "../Firebase/firebaseConfig"
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
const auth = getAuth(appFirebase)

const Formingresar = ({titulo}) =>{ 
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await signInWithEmailAndPassword (auth, email, contraseña)
            navigate("/");
            }catch (error){
                alert ("el correo o la contraseña son incorrectos")
            }
        }

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

                <br></br>

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
                

            </div>
                <button type="submit">Iniciar Sesión</button>

                <div>
                    <h3>¿No Tienes una Cuenta? <a href="/registro">Registrate</a></h3>
                </div>
            </form>
        </div>
    );
};

export default Formingresar;