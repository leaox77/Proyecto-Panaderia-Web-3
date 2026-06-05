import { FaHome, FaBox,FaTags, FaSignOutAlt, FaBreadSlice } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function Navbar(){
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        navigate("/")
    }
    return (
        <nav className="navbar">
            <div className="brand">
                <FaBreadSlice/>

                <span>Panaderia</span>
            </div>

            <ul>
                <li><FaHome/>Inicio</li>
                <li><FaBox/>Productos</li>
                <li><FaTags/>Categorias</li>
                <li onClick={cerrarSesion}><FaSignOutAlt/>Salir</li>
            </ul>
        </nav>
    )
}

export default Navbar;