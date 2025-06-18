import '../css/nav.css'
function Navbar() {
  return (
    <div className="navbar">
      <img src="logo.png" alt="Logo EPET N°20" />
      <a href="/">Inicio</a>

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
    </div>
  );
}

export default Navbar;
