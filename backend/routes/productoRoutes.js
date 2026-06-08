/**
 * Rutas para gestión de productos (CRUD completo)
 * NOVEDAD: Separación de rutas - Empleados pueden gestionar productos
 */

const express = require("express");
const db = require("../db");
const { verificarToken, verificarRol } = require("../middleware/authMiddleware");

const router = express.Router();

//FUNCIONES DE VALIDACION

function validaNombre(nombre){
    if (!nombre || typeof nombre !== 'string') return false;
    const trimed = nombre.trim();
    return trimed.length >= 2 && trimed.length <= 100;
}

function validaPrecio(precio){
    const precioNum = parseFloat(precio);
    return !isNaN(precioNum) && precioNum > 0 && precioNum<=999999.99
}

function validarStock(stock) {
    const stockNum = parseInt(stock);
    return !isNaN(stockNum) && stockNum > 0 && stockNum<=999999
}

function validarDesc(descripcion){
    if (!descripcion) return true;
    return descripcion.length <= 500;
}

async function validarCategoriaId(categoria_id) {
    const categoriaNum = parseInt(categoria_id);
    if (isNaN(categoriaNum) || categoriaNum <= 0) return false;

    return new Promise((resolve)=>{
        db.query("select id from categorias where id = ? and estado = 1", [categoriaNum], (err, result)=>{
            resolve(!err && result && result.length > 0);
        })
    })
} 

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

    const errores = [];

    //validaciones

    if(!validaNombre(nombre)){
        errores.push("el nombre debe tener entre 2 y 100 caracteres")
    }

    if(!validaPrecio(precio)){
        errores.push("el precio debe estar entre 0 y 999999.99")
    }

    if(!validarStock(stock)){
        errores.push("el stock debe ser un numeor mayor o igual a 0")
    }

    if(!validarDesc(descripcion)){
        errores.push("la descripcion no puede exceder los 500 caracteres")
    }

    //valida que la categoria exista

    const categoriaValida = validarCategoriaId(categoria_id);
    if (!categoriaValida) {
        error.push("la categoria seleccionada no es valida")
    }

    if (errores.length > 0){
        return res.status(400).json({
            mensaje: "errores de validacion",
            errores: errores
        })
    }

    const sql = `
        INSERT INTO productos (nombre, precio, stock, descripcion, categoria_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nombre.trim(), parseFloat(precio), parseInt(stock), (descripcion || '').trim, parseInt(categoria_id)], (err, result) => {
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

    const errores = [];

    //validaciones

    if(!validaNombre(nombre)){
        errores.push("el nombre debe tener entre 2 y 100 caracteres")
    }

    if(!validaPrecio(precio)){
        errores.push("el precio debe estar entre 0 y 999999.99")
    }

    if(!validarStock(stock)){
        errores.push("el stock debe ser un numeor mayor o igual a 0")
    }

    if(!validarDesc(descripcion)){
        errores.push("la descripcion no puede exceder los 500 caracteres")
    }

    //valida que la categoria exista

    const categoriaValida = validarCategoriaId(categoria_id);
    if (!categoriaValida) {
        error.push("la categoria seleccionada no es valida")
    }

    if (errores.length > 0){
        return res.status(400).json({
            mensaje: "errores de validacion",
            errores: errores
        })
    }

    const sql = `
        UPDATE productos 
        SET nombre = ?, precio = ?, stock = ?, descripcion = ?, categoria_id = ?
        WHERE id = ? AND estado = 1
    `;

    db.query(sql, [nombre.trim(), parseFloat(precio), parseInt(stock), (descripcion || '').trim, parseInt(categoria_id)], (err, result) => {
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