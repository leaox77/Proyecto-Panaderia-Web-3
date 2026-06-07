/**
 * Rutas para gestión de usuarios (SOLO ADMIN)
 * NOVEDAD: CRUD completo de usuarios con control de acceso
 */

const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");

const router = express.Router();

// Todas las rutas de usuarios son SOLO para Administradores (rol_id = 1)
router.use(verificarToken, verificarRol(1));

// ==================== OBTENER TODOS LOS USUARIOS ====================
/**
 * @route GET /usuarios
 * @description Obtiene todos los usuarios (excepto contraseñas)
 */
router.get("/usuarios", (req, res) => {
    const sql = `
        SELECT u.id, u.nombre, u.correo, u.rol_id, u.estado, u.fecha_creacion,
               r.nombre as rol_nombre
        FROM usuarios u
        INNER JOIN roles r ON u.rol_id = r.id
        ORDER BY u.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al obtener usuarios"
            });
        }
        res.json(result);
    });
});

// ==================== OBTENER UN USUARIO ====================
router.get("/usuarios/:id", (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT u.id, u.nombre, u.correo, u.rol_id, u.estado
        FROM usuarios u
        WHERE u.id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                mensaje: "Error al obtener usuario"
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }
        res.json(result[0]);
    });
});

// ==================== CREAR USUARIO ====================
router.post("/usuarios", async (req, res) => {
    const { nombre, correo, contrasena, rol_id } = req.body;

    if (!nombre || !correo || !contrasena || !rol_id) {
        return res.status(400).json({
            mensaje: "Todos los campos son requeridos"
        });
    }

    try {
        const passwordHash = await bcrypt.hash(contrasena, 10);
        const sql = `INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, ?)`;

        db.query(sql, [nombre, correo, passwordHash, rol_id], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({
                        mensaje: "El correo ya está registrado"
                    });
                }
                return res.status(500).json({
                    mensaje: "Error al crear usuario"
                });
            }
            res.json({
                id: result.insertId,
                mensaje: "✅ Usuario creado exitosamente"
            });
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error del servidor"
        });
    }
});

// ==================== ACTUALIZAR USUARIO ====================
router.put("/usuarios/:id", async (req, res) => {
    const id = req.params.id;
    const { nombre, correo, rol_id, estado } = req.body;

    const sql = `UPDATE usuarios SET nombre = ?, correo = ?, rol_id = ?, estado = ? WHERE id = ?`;
    
    db.query(sql, [nombre, correo, rol_id, estado, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al actualizar usuario"
            });
        }
        res.json({
            mensaje: "✅ Usuario actualizado exitosamente"
        });
    });
});

// ==================== ELIMINAR USUARIO (LÓGICA) ====================
router.delete("/usuarios/:id", (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE usuarios SET estado = 0 WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                mensaje: "Error al eliminar usuario"
            });
        }
        res.json({
            mensaje: "✅ Usuario eliminado exitosamente"
        });
    });
});

module.exports = router;