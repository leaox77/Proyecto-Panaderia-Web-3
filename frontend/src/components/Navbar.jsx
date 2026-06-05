import { FaHome, FaBox,FaTags, FaSignOutAlt, FaBreadSlice } from "react-icons/fa";

function Navbar(){
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
                <li><FaSignOutAlt/>Salir</li>
            </ul>
        </nav>
    )
}

export default Navbar;