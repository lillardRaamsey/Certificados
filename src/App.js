import Navbar from './componentes/nav';
import CertificadoForm from './componentes/FormularioCertificados';
import './App.css';
import FormRegistro from './componentes/formRegistro';
import Formingresar from './componentes/formingresar';
import Inicio from './componentes/inicio';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();

  const mostrarNavbar = location.pathname !== "/";

  return (
    <div>
      {mostrarNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path="/envioCertificado" element={<CertificadoForm />} />
        <Route path="/registro" element={<FormRegistro titulo="Registro de usuario" />} />
        <Route path="/ingresar" element={<Formingresar />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;

