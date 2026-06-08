/**
 * Página de inicio de sesión con CAPTCHA
 * NOVEDAD: Sistema CAPTCHA para evitar bots
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBreadSlice, FaLock, FaEnvelope, FaSync } from "react-icons/fa";
import api, { authService } from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [captchaText, setCaptchaText] = useState("");
    const [captchaId, setCaptchaId] = useState("");
    const [captchaSvg, setCaptchaSvg] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const captchaContainerRef = useRef(null);

    // Cargar CAPTCHA al iniciar
    useEffect(() => {
        cargarCaptcha();
    }, []);

    const cargarCaptcha = async () => {
        try {
            const response = await api.get("/captcha");
            setCaptchaId(response.data.captchaId);
            setCaptchaSvg(response.data.svg);
            
            // Renderizar SVG en el DOM
            if (captchaContainerRef.current) {
                captchaContainerRef.current.innerHTML = response.data.svg;
            }
        } catch (error) {
            console.error("Error al cargar CAPTCHA:", error);
        }
    };

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError("");

        try {
            const response = await authService.login(correo, contrasena, captchaId, captchaText);
            
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
            
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            let mensajeError = "Correo, contraseña o CAPTCHA incorrectos";
            
            if (error.response?.data?.mensaje) {
                mensajeError = error.response.data.mensaje;
            }
            
            setError(mensajeError);
            // Recargar CAPTCHA en caso de error
            cargarCaptcha();
            setCaptchaText("");
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

                {/* CAPTCHA */}
                <div className="captcha-container">
                    <div className="captcha-svg" ref={captchaContainerRef}></div>
                    <button 
                        type="button" 
                        className="captcha-refresh"
                        onClick={cargarCaptcha}
                        disabled={cargando}
                    >
                        <FaSync />
                    </button>
                </div>

                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="Ingrese el código de la imagen" 
                        value={captchaText} 
                        onChange={(e) => setCaptchaText(e.target.value)}
                        required
                        disabled={cargando}
                    />
                </div>

                <button type="submit" disabled={cargando}>
                    {cargando ? "Verificando..." : "Ingresar"}
                </button>

                <button 
                    type="button" 
                    className="btn-back"
                    onClick={() => navigate("/registro")}
                >
                    📝 ¿No tienes cuenta? Regístrate
                </button>
            </form>
        </div>
    );
}

export default Login;