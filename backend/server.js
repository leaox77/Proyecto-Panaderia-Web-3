const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const db =  require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "panaderia2026"


//middleware JWT

function verificarToken(req, res, next){
    const token = req.headers.authorization;
    if (!token){
        return res.status(401).json({
            mensaje: "token requerido"
        });
    }

    try {
        const datos = jwt.verify(token, SECRET);
        req.usuario = datos

        next();
    }
    catch{
        return res.status(401).json({
            mensaje: "token invalido"
        })
    }
}

//ruta test

app.get("/", (req, res) =>{
    res.send("api funcionando")
})

// USUARIO
//registro

app.post("/registro", async (req, res)=> {
    const {
        nombre, correo, contrasena, rol_id
    } = req.body; 

    try {
        const passwordHash = await bcrypt.hash(contrasena, 10);

        const sql = `
            insert into usuarios
            (nombre, correo, contrasena, rol_id)
            values (?, ?, ?, ?)
        `;

        db.query(
            sql, [nombre, correo, passwordHash, rol_id],
            (error) => {
                if(error){
                    return res.status(500).json({
                        mensaje: "error al registrar usuario"
                    });
                }
                res.json({
                    mensaje: "usuario registrado"
                })
            }
        );
    } catch {
        res.status(500).json({
            mensaje: "error del servidor"
        });
    }
})

//login

app.post("/login", (req, res)=>{
    const {
        correo, contrasena
    } = req.body;

    // cuando el estado es 1 quiere decir que el usuario esta activo
    const sql = `
        select * from usuarios where correo = ? and estado = 1
    `;

    db.query(sql, [correo], async (error, resultado)=>{
        if(error){
            return res.status(500).json({
                mensaje: "error del servidor"
            });
        }
        if (resultado.length === 0){
            return res.status(401).json({
                mensaje: "usuario no encontrado o inactivo"
            });
        }

        const usuario = resultado[0];

        const coincide = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );

        if (!coincide){
            console.log("contrasena incorrecta")
            return res.status(401).json({
                mensaje: "cotnrasena incorrecta"
            });
        }

        const token = jwt.sign({
            id: usuario.id,
            nombre: usuario.nombre,
            rol_id: usuario.rol_id
        },
        SECRET
        );

        db.query(
            `INSERT INTO logs_acceso(usuario_id, ip, evento, browser)
            VALUES (?,?,?,?)`,
            [usuario.id, req.ip, "INGRESO", req.headers["user-agent"]]
        );

    res.json({
        token
    });
    });
});

//logout

app.post("/logout", verificarToken, (req, res)=>{
    const sql = `
    INSERT INTO logs_acceso
    (usuario_id, ip, evento, browser)
    VALUES (?,?,?,?)
    `;

    db.query(sql, [req.usuario.id, req.ip, "SALIDA", req.headers["user-agent"]]
    );
    res.json({
        mensaje: "sesion cerrada"
    })
})

// CATEGORIAS

//obtener todas las categorias

app.get("/categorias", verificarToken, (req, res)=>{
    const sql = `SELECT * FROM categorias WHERE estado=1`;

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
app.get("/categorias/:id", verificarToken, (req, res)=>{
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
app.post("/categorias", verificarToken, (req, res)=>{

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
app.put("/categorias/:id", verificarToken, (req, res)=>{

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
app.delete("/categorias/:id", verificarToken, (req, res)=>{

    const id = req.params.id;

    const sql = `UPDATE categorias SET estado = 0 WHERE id = ?`;
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
app.get("/productos", verificarToken, (req, res)=>{
    const sql = `
        SELECT * FROM productos WHERE estado = 1
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
        SELECT * FROM productos WHERE id = ?
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
app.post("/productos", verificarToken, (req, res)=>{

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
app.put("/productos/:id", verificarToken, (req, res)=>{

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
app.delete("/productos/:id", verificarToken, (req, res)=>{

    const id = req.params.id
    const sql = `
        UPDATE productos SET estado = 0 WHERE id = ?
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