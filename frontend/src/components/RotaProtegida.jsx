import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RotaProtegida({children}){
    const {usuario} = useAuth();
    if(!usuario){
        return <Navigate to ="/login" replace />;
    }

    return children; // retorna o dashboard
}

export default RotaProtegida;