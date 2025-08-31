import '../css/nav.css'
import logo from '../img/epet20.png';
function Navbar() {
  return (
    <div className="navbar">
      <img src={logo} alt="Logo EPET N°20" />
      <a href="/">Inicio</a>

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
