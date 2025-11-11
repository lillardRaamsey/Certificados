import { useState } from 'react';
import '../css/nav.css';
import logo from '../img/epet20.png';
import userImg from '../img/ftperfil.jpg';
import { Link } from 'react-router-dom';

function Navbar() {
  const [Cerrar, setCerrar] = useState(false);

  const handleLogout = () => {
    alert('Sesión cerrada'); // Acá podrías agregar tu lógica real
    setCerrar(false);
  };

  return (
    <div className="navbar">
      <img src={logo} alt="Logo EPET N°20" />
      <Link className="navText" to="/">Inicio</Link>
      <div className="usuario">
        <img src={userImg} alt="Foto de perfil" onClick={() => setCerrar(!Cerrar)} />
        {Cerrar && (
          <div className="infoyce">
            <button className="btn-cerrar" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;