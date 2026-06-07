/**
 * Componente para rutas protegidas que requieren autenticación
 * NOVEDAD: Verifica si el usuario está logueado antes de mostrar la página
 */

import { Navigate } from "react-router-dom";

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar
 * @returns {React.ReactNode} - Redirige al login si no hay token
 */
function ProtectedRoute({ children }) {
    // Verifica si existe un token en localStorage
    const token = localStorage.getItem("token");
    
    if (!token) {
        // Redirige al login si no hay token
        return <Navigate to="/" replace />;
    }
    
    // Si hay token, muestra los componentes hijos
    return children;
}

export default ProtectedRoute;