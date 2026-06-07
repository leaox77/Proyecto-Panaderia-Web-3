/**
 * Componente de navegación/barra de menú
 * NOVEDAD: Muestra diferentes opciones según el rol del usuario
 */

import { FaHome, FaBox, FaTags, FaSignOutAlt, FaBreadSlice, FaUsers } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

// Rol Administrador = 1, Rol Empleado = 2
const ROL_ADMIN = 1;

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Obtiene el usuario del localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const esAdmin = usuario.rol_id === ROL_ADMIN;

    /**
     * Cierra la sesión del usuario
     * Registra el evento de salida en el backend
     */
    const cerrarSesion = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            navigate("/");
        }
    };

    /**
     * Navega a la ruta indicada
     */
    const irA = (ruta) => {
        navigate(ruta);
    };

    return (
        <nav className="navbar">
            <div className="brand" onClick={() => irA("/dashboard")}>
                <FaBreadSlice />
                <span>Panadería El Buen Pan</span>
            </div>

            <ul>
                <li onClick={() => irA("/dashboard")} className={location.pathname === "/dashboard" ? "active" : ""}>
                    <FaHome /> Inicio
                </li>
                <li onClick={() => irA("/productos")} className={location.pathname === "/productos" ? "active" : ""}>
                    <FaBox /> Productos
                </li>
                {/* Solo el Administrador puede ver Categorías y Usuarios */}
                {esAdmin && (
                    <>
                        <li onClick={() => irA("/categorias")} className={location.pathname === "/categorias" ? "active" : ""}>
                            <FaTags /> Categorías
                        </li>
                        <li onClick={() => irA("/usuarios")} className={location.pathname === "/usuarios" ? "active" : ""}>
                            <FaUsers /> Usuarios
                        </li>
                    </>
                )}
                <li onClick={cerrarSesion}>
                    <FaSignOutAlt /> Salir
                </li>
            </ul>
            
            {/* Muestra el rol del usuario */}
            <div className="user-info">
                <span>👤 {usuario.nombre || "Usuario"}</span>
                <small>({esAdmin ? "Administrador" : "Empleado"})</small>
            </div>
        </nav>
    );
}

export default Navbar;