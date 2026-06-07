/**
 * Middleware de autenticación y autorización
 * NOVEDAD: Separa la lógica de verificación de token y roles
 */

const jwt = require("jsonwebtoken");

// Carga variables de entorno
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

/**
 * Middleware para verificar que el usuario tiene un token válido
 * @param {Object} req - Petición HTTP
 * @param {Object} res - Respuesta HTTP  
 * @param {Function} next - Siguiente middleware
 */
function verificarToken(req, res, next) {
    // El token viene en el header Authorization
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({
            mensaje: "🔐 Token requerido - Por favor inicie sesión"
        });
    }

    try {
        // Verifica y decodifica el token
        const datos = jwt.verify(token, SECRET);
        // Guarda los datos del usuario en la petición
        req.usuario = datos;
        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: "❌ Token inválido o expirado"
        });
    }
}

/**
 * Middleware factory para verificar roles específicos
 * @param {Array} rolesPermitidos - Lista de roles que pueden acceder
 * @returns {Function} Middleware de verificación de roles
 */
function verificarRol(...rolesPermitidos) {
    return (req, res, next) => {
        // Verifica que el usuario esté autenticado
        if (!req.usuario) {
            return res.status(401).json({
                mensaje: "No autenticado"
            });
        }

        // Verifica si el rol del usuario está permitido
        // NOTA: En la BD: rol_id = 1 es Administrador, rol_id = 2 es Empleado
        if (!rolesPermitidos.includes(req.usuario.rol_id)) {
            return res.status(403).json({
                mensaje: "⛔ Acceso denegado - No tienes permisos para esta acción"
            });
        }

        next();
    };
}

module.exports = {
    verificarToken,
    verificarRol
};