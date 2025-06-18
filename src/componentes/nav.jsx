import '../css/nav.css'
import logo from '../img/epet20.png';
function Navbar() {
  return (
    <div className="navbar">
      <img src={logo} alt="Logo EPET N°20" />
      <a href="/envioCertificado">Inicio</a>

      <div className="dropdown">
        <a href="#">Alumnos ▼</a>
        <div className="dropdown-content">
          <a href="/alumnos/opcion1">Opción 1</a>
          <a href="/alumnos/opcion2">Opción 2</a>
        </div>
      </div>

      <div className="dropdown">
        <a href="#">Docentes ▼</a>
        <div className="dropdown-content">
          <a href="/docentes/opcion1">Opción 1</a>
          <a href="/docentes/opcion2">Opción 2</a>
        </div>
      </div>
      <div className="dropdown">
        <a href="/registro">registro</a>
        <div className="dropdown-content">
      </div>
      </div>
      <div className="dropdown">
        <a href="/ingresar">inicio de sesion</a>
        <div className="dropdown-content">
        </div>
      </div>
    </div>
  );
}

export default Navbar;
