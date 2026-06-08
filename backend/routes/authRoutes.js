/**
 * Rutas de autenticación con CAPTCHA
 * NOVEDAD: Sistema de CAPTCHA para evitar bots
 */

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
const db = require("../db");
const { verificarToken } = require("../middleware/authMiddleware");

require('dotenv').config();
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// Almacenamiento temporal de CAPTCHAs (en producción usar Redis)
const captchaStore = new Map();

// Limpiar CAPTCHAs viejos cada 5 minutos
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of captchaStore.entries()) {
        if (now - value.timestamp > 300000) { // 5 minutos
            captchaStore.delete(key);
        }
    }
}, 300000);

// ==================== GENERAR CAPTCHA ====================
/**
 * @route GET /captcha
 * @description Genera un nuevo CAPTCHA
 * @returns {SVG} Imagen SVG del CAPTCHA
 */
router.get("/captcha", (req, res) => {
    // Crear CAPTCHA con configuración
    const captcha = svgCaptcha.create({
        size: 6,           // Longitud del texto
        ignoreChars: '0o1i', // Caracteres a evitar
        noise: 2,          // Líneas de ruido
        color: true,       // Color aleatorio
        background: '#f8f9fa',
        width: 150,
        height: 50
    });
    
    // Generar ID único para este CAPTCHA
    const captchaId = Math.random().toString(36).substring(2, 15);
    
    // Guardar el texto del CAPTCHA con timestamp
    captchaStore.set(captchaId, {
        text: captcha.text.toLowerCase(),
        timestamp: Date.now()
    });
    
    // Enviar la imagen SVG y el ID
    res.json({
        captchaId: captchaId,
        svg: captcha.data
    });
});

// ==================== VERIFICAR CAPTCHA ====================
/**
 * Función para verificar el CAPTCHA
 */
function verificarCaptcha(captchaId, userInput) {
    const stored = captchaStore.get(captchaId);
    if (!stored) return false;
    
    const isValid = stored.text === userInput.toLowerCase();
    // Eliminar CAPTCHA después de usarlo (un solo uso)
    captchaStore.delete(captchaId);
    return isValid;
}

// ==================== LOGIN CON CAPTCHA ====================
/**
 * @route POST /login
 * @description Inicia sesión verificando CAPTCHA
 * @body {correo, contrasena, captchaId, captchaText}
 */
router.post("/login", (req, res) => {
    const { correo, contrasena, captchaId, captchaText } = req.body;
    
    // Verificar CAPTCHA primero
    if (!captchaId || !captchaText) {
        return res.status(400).json({
            mensaje: "❌ CAPTCHA requerido"
        });
    }
    
    const captchaValido = verificarCaptcha(captchaId, captchaText);
    if (!captchaValido) {
        return res.status(400).json({
            mensaje: "❌ CAPTCHA incorrecto. Intente nuevamente."
        });
    }

    const sql = `SELECT * FROM usuarios WHERE correo = ? AND estado = 1`;

    db.query(sql, [correo], async (error, resultado) => {
        if (error) {
            return res.status(500).json({
                mensaje: "Error del servidor"
            });
        }

        if (resultado.length === 0) {
            return res.status(401).json({
                mensaje: "❌ Usuario no encontrado o cuenta inactiva"
            });
        }

        const usuario = resultado[0];
        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!coincide) {
            return res.status(401).json({
                mensaje: "❌ Contraseña incorrecta"
            });
        }

        const token = jwt.sign({
            id: usuario.id,
            nombre: usuario.nombre,
            rol_id: usuario.rol_id,
            correo: usuario.correo
        }, SECRET, { expiresIn: '8h' });

        db.query(
            `INSERT INTO logs_acceso(usuario_id, ip, evento, browser)
             VALUES (?, ?, ?, ?)`,
            [usuario.id, req.ip, "INGRESO", req.headers["user-agent"]]
        );

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol_id: usuario.rol_id
            }
        });
    });
});

// ==================== REGISTRO DE USUARIOS ====================
router.post("/registro", async (req, res) => {
    const { nombre, correo, contrasena, rol_id } = req.body;

    try {
        const passwordHash = await bcrypt.hash(contrasena, 10);

        const sql = `
            INSERT INTO usuarios (nombre, correo, contrasena, rol_id)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [nombre, correo, passwordHash, rol_id], (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({
                        mensaje: "❌ El correo ya está registrado"
                    });
                }
                return res.status(500).json({
                    mensaje: "Error al registrar usuario"
                });
            }
            res.json({
                mensaje: "✅ Usuario registrado exitosamente"
            });
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error del servidor"
        });
    }
});

// ==================== LOGOUT ====================
router.post("/logout", verificarToken, (req, res) => {
    const sql = `
        INSERT INTO logs_acceso (usuario_id, ip, evento, browser)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [req.usuario.id, req.ip, "SALIDA", req.headers["user-agent"]]);
    
    res.json({
        mensaje: "✅ Sesión cerrada correctamente"
    });
});

module.exports = router;