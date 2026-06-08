/**
 * Componente de gráfico estadístico
 * NOVEDAD: Muestra gráfico de productos por categoría
 */

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { productoService, categoriaService } from "../services/api";

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function EstadisticasChart() {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [tipoGrafico, setTipoGrafico] = useState("barras");

    useEffect(() => {
        cargarDatosEstadisticos();
    }, []);

    const cargarDatosEstadisticos = async () => {
        try {
            const [productosRes, categoriasRes] = await Promise.all([
                productoService.getAll(),
                categoriaService.getAll()
            ]);

            const productos = productosRes.data;
            const categorias = categoriasRes.data;

            // Contar productos por categoría
            const productosPorCategoria = categorias.map(categoria => ({
                nombre: categoria.nombre,
                cantidad: productos.filter(p => p.categoria_id === categoria.id).length
            }));

            // Calcular estadísticas adicionales
            const totalProductos = productos.length;
            const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
            const valorTotalInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

            setDatos({
                categorias: productosPorCategoria,
                totalProductos,
                totalStock,
                valorTotalInventario
            });
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        } finally {
            setCargando(false);
        }
    };

    // Configuración para gráfico de barras
    const barChartData = {
        labels: datos?.categorias.map(c => c.nombre) || [],
        datasets: [
            {
                label: 'Cantidad de Productos',
                data: datos?.categorias.map(c => c.cantidad) || [],
                backgroundColor: 'rgba(139, 69, 19, 0.7)',
                borderColor: 'rgba(139, 69, 19, 1)',
                borderWidth: 1,
                borderRadius: 8,
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '📊 Productos por Categoría',
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Productos: ${context.raw}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
                title: {
                    display: true,
                    text: 'Cantidad de Productos'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Categorías'
                }
            }
        }
    };

    if (cargando) {
        return <div style={{ textAlign: "center", padding: "30px" }}>Cargando estadísticas...</div>;
    }

    return (
        <div className="estadisticas-container">
            <div className="dashboard-header" style={{ marginBottom: "20px" }}>
                <h2>📈 Estadísticas de la Panadería</h2>
                <div className="chart-type-buttons">
                    <button 
                        className={tipoGrafico === "barras" ? "active" : ""}
                        onClick={() => setTipoGrafico("barras")}
                    >
                        📊 Barras
                    </button>
                    <button 
                        className={tipoGrafico === "resumen" ? "active" : ""}
                        onClick={() => setTipoGrafico("resumen")}
                    >
                        📋 Resumen
                    </button>
                </div>
            </div>

            {tipoGrafico === "barras" ? (
                <div className="chart-container">
                    <Bar data={barChartData} options={barChartOptions} />
                </div>
            ) : (
                <div className="resumen-stats">
                    <div className="stat-card-resumen">
                        <div className="stat-icon">🍞</div>
                        <div className="stat-info">
                            <h3>Total Productos</h3>
                            <p>{datos?.totalProductos}</p>
                        </div>
                    </div>
                    <div className="stat-card-resumen">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>Stock Total</h3>
                            <p>{datos?.totalStock} unidades</p>
                        </div>
                    </div>
                    <div className="stat-card-resumen">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <h3>Valor del Inventario</h3>
                            <p>${datos?.valorTotalInventario.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="stat-card-resumen">
                        <div className="stat-icon">🏷️</div>
                        <div className="stat-info">
                            <h3>Categorías</h3>
                            <p>{datos?.categorias.length}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EstadisticasChart;