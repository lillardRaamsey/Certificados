import '../css/nav.css'
import logo from '../img/epet20.png';
import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <div className="navbar">
      <img src={logo} alt="Logo EPET N°20" />
      <Link className='navText' to="/">Inicio</Link>
      
    </div>
  );
}

export default Navbar;
