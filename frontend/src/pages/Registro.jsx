/**
 * Página de registro de usuarios
 * NOVEDAD: Validación de contraseña (débil/intermedia/fuerte)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBreadSlice, FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { authService } from "../services/api";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";
import { validarRequisitosPassword } from "../utils/passwordStrength";

function Registro() {
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
        rol_id: "2" // Por defecto Empleado
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError("");
        setExito("");
        
        // Validar que las contraseñas coincidan
        if (formData.contrasena !== formData.confirmarContrasena) {
            setError("❌ Las contraseñas no coinciden");
            setCargando(false);
            return;
        }
        
        // Validar requisitos de contraseña
        const validacion = validarRequisitosPassword(formData.contrasena);
        if (!validacion.isValid) {
            setError(validacion.errors[0]);
            setCargando(false);
            return;
        }
        
        try {
            await authService.registro({
                nombre: formData.nombre,
                correo: formData.correo,
                contrasena: formData.contrasena,
                rol_id: parseInt(formData.rol_id)
            });
            
            setExito("✅ Usuario registrado exitosamente. Redirigiendo al login...");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            if (error.response?.data?.mensaje) {
                setError(error.response.data.mensaje);
            } else {
                setError("Error al registrar usuario");
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-card registro-card" onSubmit={handleSubmit}>
                <FaBreadSlice className="logo" />
                <h1>Registro de Usuario</h1>
                <p>Crea una cuenta para acceder al sistema</p>

                {error && <div className="error-message">⚠️ {error}</div>}
                {exito && <div className="success-message">✅ {exito}</div>}

                <div className="input-group">
                    <FaUser />
                    <input 
                        type="text" 
                        name="nombre"
                        placeholder="Nombre completo" 
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        disabled={cargando}
                    />
                </div>

                <div className="input-group">
                    <FaEnvelope />
                    <input 
                        type="email" 
                        name="correo"
                        placeholder="Correo electrónico" 
                        value={formData.correo}
                        onChange={handleChange}
                        required
                        disabled={cargando}
                    />
                </div>

                <div className="input-group">
                    <FaLock />
                    <input 
                        type="password" 
                        name="contrasena"
                        placeholder="Contraseña" 
                        value={formData.contrasena}
                        onChange={handleChange}
                        required
                        disabled={cargando}
                    />
                </div>
                
                {/* Indicador de fortaleza de contraseña */}
                <PasswordStrengthIndicator password={formData.contrasena} />

                <div className="input-group">
                    <FaLock />
                    <input 
                        type="password" 
                        name="confirmarContrasena"
                        placeholder="Confirmar contraseña" 
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        required
                        disabled={cargando}
                    />
                </div>

                <div className="input-group">
                    <select 
                        name="rol_id"
                        value={formData.rol_id}
                        onChange={handleChange}
                        disabled={cargando}
                    >
                        <option value="2">Empleado</option>
                        <option value="1">Administrador</option>
                    </select>
                </div>

                <button type="submit" disabled={cargando}>
                    {cargando ? "Registrando..." : "Registrarse"}
                </button>

                <button 
                    type="button" 
                    className="btn-back"
                    onClick={() => navigate("/")}
                >
                    <FaArrowLeft /> Volver al Login
                </button>
            </form>
        </div>
    );
}

export default Registro;