import React from "react";
import {Routes, Route, Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContex';
import CertificadoForm from './FormularioCertificados';
import FirestoreTable from './FirestoreTable'
const RouterApp = () => {
    const { userData } = useAuth();
    const rol = userData?.cargo;

    return (
        <Routes>
            <Route path="/envioCertificado" element={<CertificadoForm />} />
            <Route 
            path="/FirestoreTable"
            element={rol === "admin" ? <FirestoreTable/>: <Navigate to="/" />}
            />
        </Routes>
    )
}

export default RouterApp;





