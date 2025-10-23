import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";
const ProtectedRoutes = ({ children }) => {
    const{ user, loading } = useAuth();
    if (loading) return <p> Cargando....</p>;
    if (!user){ 
        return <Navigate to="/ingresar"/>;
    }
    return children;
};
export default ProtectedRoutes;

