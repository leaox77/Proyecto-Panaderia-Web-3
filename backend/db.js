/**
 * Módulo de conexión a la base de datos MySQL
 * NOVEDAD: Ahora usa variables de entorno para mayor seguridad
 */

// Importa el paquete mysql2 para crear y gestionar la conexión con MySQL
const mysql = require("mysql2");
// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Configuración de la conexión usando variables de entorno
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Intenta establecer la conexión y valida si ocurrió algún error
conexion.connect((err) => {
    if (err) {
        // NOVEDAD: Muestra el error real para facilitar el debugging
        console.error('Error en la conexión a MySQL:', err.message);
        return;
    }
    console.log('✅ MySQL conectado exitosamente');
});

// Exporta la conexión para usarla en otros módulos del backend
module.exports = conexion;