/**
 * Componente para rutas que requieren roles específicos
 * NOVEDAD: Verifica el rol del usuario antes de mostrar la página
 */

import { Navigate } from "react-router-dom";

// Rol Administrador = 1, Rol Empleado = 2
const ROLES = {
    ADMIN: 1,
    EMPLEADO: 2
};

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 * @param {Array} props.allowedRoles - Lista de roles permitidos [1] o [1,2]
 * @returns {React.ReactNode}
 */
function RoleBasedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    
    // Si no hay token, redirige al login
    if (!token) {
        return <Navigate to="/" replace />;
    }
    
    // Verifica si el rol del usuario está permitido
    if (!allowedRoles.includes(usuario.rol_id)) {
        // Redirige al dashboard si no tiene permisos
        return <Navigate to="/dashboard" replace />;
    }
    
    // Si tiene permisos, muestra los componentes hijos
    return children;
}

export { RoleBasedRoute, ROLES };