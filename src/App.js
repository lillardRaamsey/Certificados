import CertificadoForm from './componentes/FormularioCertificados';
import './App.css';
import FormRegistro from './componentes/formRegistro';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (

    <Router>
        <Routes>
            <Route path="/envioCertificado" element={<CertificadoForm />}/>
            <Route path="/registro" element={<FormRegistro titulo="Registro de usuario" />}/>
        </Routes>
    </Router>
  );
}

export default App;
