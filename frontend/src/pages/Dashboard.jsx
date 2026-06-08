/**
 * Página principal del Dashboard
 * NOVEDAD: Muestra estadísticas y bienvenida personalizada
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaTags, FaUsers, FaChartLine } from "react-icons/fa";
import { productoService, categoriaService, usuarioService } from "../services/api";
import EstadisticasChart from "../components/EstadisticasChart";

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        productos: 0,
        categorias: 0,
        usuarios: 0
    });
    const [cargando, setCargando] = useState(true);
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const esAdmin = usuario.rol_id === 1;

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const [productos, categorias, usuarios] = await Promise.all([
                productoService.getAll(),
                categoriaService.getAll(),
                esAdmin ? usuarioService.getAll() : Promise.resolve({ data: [] })
            ]);

            setStats({
                productos: productos.data.length,
                categorias: categorias.data.length,
                usuarios: esAdmin ? usuarios.data.length : 0
            });
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div>
            <div className="dashboard-header">
                <h1>📊 Panel de Control</h1>
                <p>Bienvenido, {usuario.nombre} 👋</p>
            </div>

            {cargando ? (
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <div className="spinner"></div>
                    <p>Cargando...</p>
                </div>
            ) : (
                <div className="stats-grid">
                    <div className="stat-card" onClick={() => navigate("/productos")}>
                        <FaBox />
                        <h3>Productos Activos</h3>
                        <p>{stats.productos}</p>
                    </div>

                    {esAdmin && (
                        <>
                            <div className="stat-card" onClick={() => navigate("/categorias")}>
                                <FaTags />
                                <h3>Categorías</h3>
                                <p>{stats.categorias}</p>
                            </div>

                            <div className="stat-card" onClick={() => navigate("/usuarios")}>
                                <FaUsers />
                                <h3>Usuarios Registrados</h3>
                                <p>{stats.usuarios}</p>
                            </div>
                        </>
                    )}

                    <div className="stat-card">
                        <FaChartLine />
                        <h3>Ventas del Mes</h3>
                        <p>Próximamente</p>
                    </div>

                    <EstadisticasChart/>
                </div>
            )}

            <div className="table-container">
                <h3 style={{ marginBottom: "15px" }}>📌 Accesos Rápidos</h3>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <button className="btn-primary" onClick={() => navigate("/productos")}>
                        Gestionar Productos
                    </button>
                    {esAdmin && (
                        <>
                            <button className="btn-secondary" onClick={() => navigate("/categorias")}>
                                Gestionar Categorías
                            </button>
                            <button className="btn-secondary" onClick={() => navigate("/usuarios")}>
                                Gestionar Usuarios
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;