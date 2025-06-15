import react, { useState } from "react";
import { useNavigate } from "react-router-dom"
import "../css/formingresar.css"
const Formingresar = ({titulo}) =>{ 
    const [DNI, setDNI] = useState('');
    const [contraseña, setContraseña] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/inicio-sesion", {
            state: { contraseña, DNI}
        });
    };

    return (
        <div className="form-contenedor">
            <h1>Entrega de Certificados</h1>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="glass-form">
            <div>

                <div className="form-grupo">
                    <label>Ingresar DNI: </label>
                    <input
                        type="number"
                        value={DNI}
                        onChange={(e) => setDNI(e.target.value)}
                        placeholder="12345678"
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