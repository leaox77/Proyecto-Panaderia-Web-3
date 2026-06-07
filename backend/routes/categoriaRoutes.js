/**
 * Rutas para gestión de categorías (CRUD completo)
 * NOVEDAD: Separación de rutas con control de roles
 */

const express = require("express");
const db = require("../db");
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");

const router = express.Router();

// NOTA: Rol 1 = Administrador, Rol 2 = Empleado
// Las categorías SOLO las puede gestionar el Administrador

// ==================== OBTENER TODAS LAS CATEGORÍAS ====================
/**
 * @route GET /categorias
 * @description Obtiene todas las categorías activas
 * @access Admin y Empleado (solo lectura)
 */
router.get("/categorias", verificarToken, (req, res) => {
    const sql = `SELECT * FROM categorias WHERE estado = 1 ORDER BY id DESC`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al obtener categorías"
            });
        }
        res.json(result);
    });
});

// ==================== OBTENER UNA CATEGORÍA ====================
/**
 * @route GET /categorias/:id
 * @description Obtiene una categoría específica por ID
 */
router.get("/categorias/:id", verificarToken, (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM categorias WHERE id = ? AND estado = 1`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                mensaje: "Error al obtener categoría"
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }
        res.json(result[0]);
    });
});

// ==================== CREAR CATEGORÍA ====================
/**
 * @route POST /categorias
 * @description Crea una nueva categoría (SOLO ADMIN)
 */
router.post("/categorias", verificarToken, verificarRol(1), (req, res) => {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({
            mensaje: "El nombre de la categoría es requerido"
        });
    }

    const sql = `INSERT INTO categorias (nombre) VALUES (?)`;

    db.query(sql, [nombre.trim()], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al crear categoría"
            });
        }
        res.json({
            id: result.insertId,
            mensaje: "✅ Categoría creada exitosamente"
        });
    });
});

// ==================== ACTUALIZAR CATEGORÍA ====================
/**
 * @route PUT /categorias/:id
 * @description Actualiza una categoría existente (SOLO ADMIN)
 */
router.put("/categorias/:id", verificarToken, verificarRol(1), (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({
            mensaje: "El nombre de la categoría es requerido"
        });
    }

    const sql = `UPDATE categorias SET nombre = ? WHERE id = ? AND estado = 1`;

    db.query(sql, [nombre.trim(), id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al actualizar categoría"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }
        res.json({
            mensaje: "✅ Categoría actualizada exitosamente"
        });
    });
});

// ==================== ELIMINAR CATEGORÍA (LÓGICA) ====================
/**
 * @route DELETE /categorias/:id
 * @description Eliminación lógica de categoría (SOLO ADMIN)
 */
router.delete("/categorias/:id", verificarToken, verificarRol(1), (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE categorias SET estado = 0 WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al eliminar categoría"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }
        res.json({
            mensaje: "✅ Categoría eliminada exitosamente"
        });
    });
});

module.exports = router;