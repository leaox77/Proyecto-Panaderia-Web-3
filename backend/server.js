const express = require("express");
const cors = require("cors");

const db =  require("./db");

const app = express();

app.use(cors());

app.use(express.json());

//ruta test

app.get("/", (req, res) =>{
    res.send("api funcionando")
})

// CATEGORIAS

//obtener todas las categorias

app.get("/categorias", (req, res)=>{
    const sql = `SELECT * FROM categorias`;

    db.query(sql, (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al obtener categorias"
            });
        }
        console.log("obteniendo cateogrias")
        res.json(result);
    })
})

//ontener una categoria
app.get("/categorias/:id", (req, res)=>{
    const id = req.params.id;
    const sql = `SELECT * FROM categorias WHERE id = ?`;
    // nos da un vector [elemento]
    db.query(sql, [id], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al obtener categoria"
            });
        }
        res.json(result[0]);
    })
})

//crear una categoria
app.post("/categorias", (req, res)=>{

    const { nombre } = req.body;

    const sql = `INSERT INTO categorias (nombre) VALUES (?)`;
    // nos da un vector [elemento]
    db.query(sql, [nombre], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al crear categoria"
            });
        }
        res.json({
            result,
            mensaje: "categoria creada"
        });
    })
})

//actualizar cateogria
app.put("/categorias/:id", (req, res)=>{

    const id = req.params.id;

    const { nombre } = req.body;

    const sql = `UPDATE categorias SET nombre = ? WHERE id = ?`;
    // nos da un vector [elemento]
    db.query(sql, [nombre, id], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al actualizar categoria"
            });
        }
        res.json({
            result,
            mensaje: "categoria actualizada"
        });
    })
})

//eliminar cateogria
app.delete("/categorias/:id", (req, res)=>{

    const id = req.params.id;

    const sql = `DELETE FROM categorias WHERE id = ?`;
    // nos da un vector [elemento]
    db.query(sql, [id], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al eliminar categoria"
            });
        }
        res.json({
            result,
            mensaje: "categoria eliminada"
        });
    })
})

//PRODUCTOS
app.get("/productos", (req, res)=>{
    const sql = `
        SELECT p.nombre, p.precio, p.stock, p.descripcion, c.nombre AS categoria
        FROM productos p, categorias c
        WHERE c.id = p.categoria_id
    `;

    db.query(sql, (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al obtener productos"
            });
        }
        res.json(result);
    })
})

//obtener un producto
app.get("/productos/:id", (req, res)=>{

    const id = req.params.id
    const sql = `
        SELECT p.nombre, p.precio, p.stock, p.descripcion, c.nombre AS categoria
        FROM productos p, categorias c
        WHERE c.id = p.categoria_id AND p.id = ?
    `;

    db.query(sql, [id], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al obtener producto"
            });
        }
        res.json(result[0]);
    })
})

//crear un producto
app.post("/productos", (req, res)=>{

    const {
        nombre,
        precio,
        stock,
        descripcion,
        categoria_id
    } = req.body;
    
    const sql = `
        INSERT INTO productos
        (
            nombre,
            precio,
            stock,
            descripcion,
            categoria_id
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nombre, precio, stock, descripcion, categoria_id], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al crear producto"
            });
        }
        res.json({result, mensaje:"producto creado"});
    })
})
//actualizar un producto
app.put("/productos/:id", (req, res)=>{

    const id = req.params.id
    const {
        nombre,
        precio,
        stock,
        descripcion,
        categoria_id
    } = req.body;
    const sql = `
        UPDATE productos
        SET nombre = ?, precio= ?, stock= ?, descripcion= ?, categoria_id= ? WHERE id = ?
    `;

    db.query(sql, [nombre, precio, stock, descripcion, categoria_id, id], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al actualizar producto"
            });
        }
        res.json({result, mensaje: "producto actualizado"});
    })
})

//eliminar un producto
app.delete("/productos/:id", (req, res)=>{

    const id = req.params.id
    const sql = `
        DELETE FROM productos WHERE id = ?
    `;

    db.query(sql, [id], (err, result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                mensaje: "error al eliminar producto"
            });
        }
        res.json({result, mensaje:"producto eliminado"});
    })
})



app.listen(3000, ()=>{
    console.log("servidor corriendo en puerto 3000")
})