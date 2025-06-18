import Navbar from './componentes/nav';
import CertificadoForm from './componentes/FormularioCertificados';
import './App.css';
import FormRegistro from './componentes/formRegistro';
import Formingresar from './componentes/formingresar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Navbar/>
        <Routes>
            <Route path="/envioCertificado" element={<CertificadoForm />}/>
            <Route path="/registro" element={<FormRegistro titulo="Registro de usuario" />}/>
            <Route path="/ingresar" element={<Formingresar />}/>
        </Routes>
    </Router>
  );
}

export default App;
