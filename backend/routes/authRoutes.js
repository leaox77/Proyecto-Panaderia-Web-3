/**
 * Rutas de autenticación (login, registro, logout)
 * NOVEDAD: Separación de rutas por responsabilidad
 */

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { verificarToken } = require("../middleware/authMiddleware");

require('dotenv').config();
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// ==================== REGISTRO DE USUARIOS ====================
/**
 * @route POST /registro
 * @description Registra un nuevo usuario en el sistema
 * @body {nombre, correo, contrasena, rol_id}
 */
router.post("/registro", async (req, res) => {
    const { nombre, correo, contrasena, rol_id } = req.body;

    try {
        // Encripta la contraseña antes de guardarla
        const passwordHash = await bcrypt.hash(contrasena, 10);

        const sql = `
            INSERT INTO usuarios (nombre, correo, contrasena, rol_id)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [nombre, correo, passwordHash, rol_id], (error, result) => {
            if (error) {
                // Verifica si es error de correo duplicado
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

// ==================== LOGIN DE USUARIOS ====================
/**
 * @route POST /login
 * @description Inicia sesión y genera un token JWT
 * @body {correo, contrasena}
 */
router.post("/login", (req, res) => {
    const { correo, contrasena } = req.body;

    // Busca usuario activo por correo (estado = 1)
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

        // Compara la contraseña ingresada con la encriptada
        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!coincide) {
            return res.status(401).json({
                mensaje: "❌ Contraseña incorrecta"
            });
        }

        // Genera el token JWT con los datos del usuario
        const token = jwt.sign({
            id: usuario.id,
            nombre: usuario.nombre,
            rol_id: usuario.rol_id,
            correo: usuario.correo
        }, SECRET, { expiresIn: '8h' }); // Token expira en 8 horas

        // Registra el evento de ingreso en logs
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

// ==================== LOGOUT ====================
/**
 * @route POST /logout
 * @description Registra la salida del usuario y cierra sesión
 * @header Authorization: Bearer token
 */
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