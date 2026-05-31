// Importa el paquete mysql2 para crear y gestionar la conexión con MySQL.
const mysql = require("mysql2");

// Define la conexión a la base de datos local del proyecto.
const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'panaderia',
});

// Intenta establecer la conexión y valida si ocurrió algún error.
conexion.connect((err)=>{
    if (err){
        // Si la conexión falla, se muestra un mensaje por consola.
        console.log('error en la conexion');
        return;
    }

    // Si la conexión es exitosa, se confirma por consola.
    console.log('mysql conectado');
});

// Exporta la conexión para usarla en otros módulos del backend.
module.exports = conexion;