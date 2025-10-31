import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";

const PublicRoute = ({ children }) => {
    const {user, loading} = useAuth();
    
    if (loading) return <p>cargando....</p>

    return children;
};
export default PublicRoute;


