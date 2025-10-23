import React from "react";
import {Routes, Route, Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContex';
import Tabla from './tabla';
import CertificadoForm from './FormularioCertificados';
const RouterApp = () => {
    const { userData } = useAuth();
    const rol = userData?.cargo;

    return (
        <Routes>
            <Route path="/envioCertificado" element={<CertificadoForm />} />
            <Route 
            path="/tabla"
            element={rol === "admin" ? <Tabla/>: <Navigate to="/" />}
            />
        </Routes>
    )
}

export default RouterApp;





