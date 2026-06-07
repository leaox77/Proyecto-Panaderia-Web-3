/**
 * Rutas para gestión de productos (CRUD completo)
 * NOVEDAD: Separación de rutas - Empleados pueden gestionar productos
 */

const express = require("express");
const db = require("../db");
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");

const router = express.Router();

// NOTA: Rol 1 = Administrador, Rol 2 = Empleado
// Ambos roles pueden gestionar productos (Admin y Empleado)

// ==================== OBTENER TODOS LOS PRODUCTOS ====================
/**
 * @route GET /productos
 * @description Obtiene todos los productos activos
 * @access Admin y Empleado
 */
router.get("/productos", verificarToken, (req, res) => {
    const sql = `
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p
        INNER JOIN categorias c ON p.categoria_id = c.id
        WHERE p.estado = 1
        ORDER BY p.id DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al obtener productos"
            });
        }
        res.json(result);
    });
});

// ==================== OBTENER UN PRODUCTO ====================
/**
 * @route GET /productos/:id
 * @description Obtiene un producto específico por ID
 */
router.get("/productos/:id", verificarToken, (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p
        INNER JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = ? AND p.estado = 1
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                mensaje: "Error al obtener producto"
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }
        res.json(result[0]);
    });
});

// ==================== CREAR PRODUCTO ====================
/**
 * @route POST /productos
 * @description Crea un nuevo producto
 * @access Admin y Empleado
 */
router.post("/productos", verificarToken, verificarRol(1, 2), (req, res) => {
    const { nombre, precio, stock, descripcion, categoria_id } = req.body;

    // Validaciones de campos
    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ mensaje: "El nombre es requerido" });
    }
    if (!precio || precio <= 0) {
        return res.status(400).json({ mensaje: "El precio debe ser mayor a 0" });
    }
    if (!stock || stock < 0) {
        return res.status(400).json({ mensaje: "El stock no puede ser negativo" });
    }
    if (!categoria_id) {
        return res.status(400).json({ mensaje: "Debe seleccionar una categoría" });
    }

    const sql = `
        INSERT INTO productos (nombre, precio, stock, descripcion, categoria_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nombre.trim(), precio, stock, descripcion || '', categoria_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al crear producto"
            });
        }
        res.json({
            id: result.insertId,
            mensaje: "✅ Producto creado exitosamente"
        });
    });
});

// ==================== ACTUALIZAR PRODUCTO ====================
/**
 * @route PUT /productos/:id
 * @description Actualiza un producto existente
 * @access Admin y Empleado
 */
router.put("/productos/:id", verificarToken, verificarRol(1, 2), (req, res) => {
    const id = req.params.id;
    const { nombre, precio, stock, descripcion, categoria_id } = req.body;

    // Validaciones
    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ mensaje: "El nombre es requerido" });
    }
    if (!precio || precio <= 0) {
        return res.status(400).json({ mensaje: "El precio debe ser mayor a 0" });
    }
    if (!stock || stock < 0) {
        return res.status(400).json({ mensaje: "El stock no puede ser negativo" });
    }

    const sql = `
        UPDATE productos 
        SET nombre = ?, precio = ?, stock = ?, descripcion = ?, categoria_id = ?
        WHERE id = ? AND estado = 1
    `;

    db.query(sql, [nombre.trim(), precio, stock, descripcion || '', categoria_id, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al actualizar producto"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }
        res.json({
            mensaje: "✅ Producto actualizado exitosamente"
        });
    });
});

// ==================== ELIMINAR PRODUCTO (LÓGICA) ====================
/**
 * @route DELETE /productos/:id
 * @description Eliminación lógica de producto
 * @access Admin y Empleado
 */
router.delete("/productos/:id", verificarToken, verificarRol(1, 2), (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE productos SET estado = 0 WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                mensaje: "Error al eliminar producto"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }
        res.json({
            mensaje: "✅ Producto eliminado exitosamente"
        });
    });
});

module.exports = router;