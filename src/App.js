import Navbar from './componentes/nav';

import './App.css';
import FormRegistro from './componentes/formRegistro';
import Formingresar from './componentes/formingresar';
import Inicio from './componentes/inicio';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContex';
import ProtectedRoutes from './componentes/protectedRoute';
import PublicRoute from './componentes/publicRoute';
import FirestoreTable from './componentes/FirestoreTable';

import RouterApp from './componentes/routerApp';

function Layout() {
  const location = useLocation();

  const mostrarNavbar = location.pathname !== "/";
  return (
    <div>
      <AuthProvider>
        {mostrarNavbar && <Navbar />}
        <Routes>
          <Route path='/' element={<Inicio />} />
          
          <Route path="/registro" element={  
            <PublicRoute>
              <FormRegistro titulo="Registro de usuario" />
            </PublicRoute>
            } />
          
          <Route path="/ingresar" element={
            <PublicRoute>
              <Formingresar />
            </PublicRoute>
            } />
          
          <Route path="/admin" element={
            <PublicRoute>
              <FirestoreTable />
            </PublicRoute>
            } />

          <Route 
            path='/*'
            element={
              <ProtectedRoutes>
                <RouterApp/>
              </ProtectedRoutes>
            }
            />
        </Routes>
      </AuthProvider>
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


function Table() {
  return (
    <div className="Table">
      <header>
        <h1>Mi Aplicación con Datos de Firebase</h1>
      </header>
      {"/componentes/FirestoreTable.jsx"}
      <FirestoreTable />
    </div>
  );
}



export default App;

