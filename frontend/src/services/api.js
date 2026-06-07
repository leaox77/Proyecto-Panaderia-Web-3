/**
 * Servicio centralizado para peticiones a la API
 * NOVEDAD: Manejo de token automático y URLs centralizadas
 */

import axios from "axios";

// URL base de la API (cambiar según entorno)
const API_URL = "http://localhost:3000";

// Configuración base de axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

/**
 * Interceptor para agregar el token a todas las peticiones
 * El token se guarda en localStorage después del login
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor para manejar respuestas
 * Si el token expiró (401), redirige al login
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

// ==================== SERVICIOS DE AUTENTICACIÓN ====================
export const authService = {
    login: (correo, contrasena) => 
        api.post("/login", { correo, contrasena }),
    
    registro: (datos) => 
        api.post("/registro", datos),
    
    logout: () => 
        api.post("/logout")
};

// ==================== SERVICIOS DE CATEGORÍAS ====================
export const categoriaService = {
    getAll: () => api.get("/categorias"),
    getOne: (id) => api.get(`/categorias/${id}`),
    create: (nombre) => api.post("/categorias", { nombre }),
    update: (id, nombre) => api.put(`/categorias/${id}`, { nombre }),
    delete: (id) => api.delete(`/categorias/${id}`)
};

// ==================== SERVICIOS DE PRODUCTOS ====================
export const productoService = {
    getAll: () => api.get("/productos"),
    getOne: (id) => api.get(`/productos/${id}`),
    create: (datos) => api.post("/productos", datos),
    update: (id, datos) => api.put(`/productos/${id}`, datos),
    delete: (id) => api.delete(`/productos/${id}`)
};

// ==================== SERVICIOS DE USUARIOS ====================
export const usuarioService = {
    getAll: () => api.get("/usuarios"),
    getOne: (id) => api.get(`/usuarios/${id}`),
    create: (datos) => api.post("/usuarios", datos),
    update: (id, datos) => api.put(`/usuarios/${id}`, datos),
    delete: (id) => api.delete(`/usuarios/${id}`)
};

export default api;