import { Navigate } from "react-router-dom";

function PrivadaLayout({ children }) {

    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
        return <Navigate to="/login" />;
    }
    
    return children;
}

export default PrivadaLayout;