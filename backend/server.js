/**
 * Servidor principal de la API
 * NOVEDAD: Estructura modular con rutas separadas y variables de entorno
 */

const express = require("express");
const cors = require("cors");
require('dotenv').config();

// Importación de rutas modulares
const authRoutes = require("./routes/authRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const productoRoutes = require("./routes/productoRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES GLOBALES ====================
app.use(cors());                    // Permite peticiones desde el frontend
app.use(express.json());            // Parseo de JSON en las peticiones

// ==================== RUTAS DE LA API ====================
// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        mensaje: "🍞 API de Panadería funcionando correctamente",
        version: "1.0.0",
        endpoints: {
            auth: "/login, /registro, /logout",
            categorias: "/categorias",
            productos: "/productos",
            usuarios: "/usuarios"
        }
    });
});

// Rutas de autenticación (públicas)
app.use(authRoutes);

// Rutas protegidas (requieren autenticación)
app.use(categoriaRoutes);
app.use(productoRoutes);
app.use(usuarioRoutes);

// ==================== MANEJO DE ERRORES GLOBAL ====================
app.use((err, req, res, next) => {
    console.error("Error no manejado:", err);
    res.status(500).json({
        mensaje: "Error interno del servidor"
    });
});

// ==================== INICIO DEL SERVIDOR ====================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});