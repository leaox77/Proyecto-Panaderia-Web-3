/**
 * Página de inicio de sesión
 * NOVEDAD: SweetAlert para mensajes más bonitos, mejor manejo de errores
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBreadSlice, FaLock, FaEnvelope } from "react-icons/fa";
import { authService } from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError("");

        try {
            const response = await authService.login(correo, contrasena);
            
            // Guarda el token y los datos del usuario
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
            
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            let mensajeError = "Correo o contraseña incorrectos";
            
            if (error.response?.data?.mensaje) {
                mensajeError = error.response.data.mensaje;
            }
            
            setError(mensajeError);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={iniciarSesion}>
                <FaBreadSlice className="logo" />
                <h1>Panadería</h1>
                <p>Inicie sesión para continuar</p>

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                <div className="input-group">
                    <FaEnvelope />
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        value={correo} 
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        disabled={cargando}
                    />
                </div>

                <div className="input-group">
                    <FaLock />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={contrasena} 
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                        disabled={cargando}
                    />
                </div>

                <button type="submit" disabled={cargando}>
                    {cargando ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </div>
    );
}

export default Login;