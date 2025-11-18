import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";
const ProtectedRoutes = ({ children, roles }) => {
    const{ user, userData, loading } = useAuth();
    if (loading) return <p> Cargando....</p>;
    if (!user){ 
        return <Navigate to="/ingresar"/>;
    }
    if (roles && !roles.includes(userData?.cargo)){
        return <Navigate to="/"/>;
    }
    return children;
};
export default ProtectedRoutes;

