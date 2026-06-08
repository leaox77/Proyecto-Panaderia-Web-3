/**
 * Página de gestión de productos (COMPLETA)
 * NOVEDAD: CRUD completo + Reporte PDF
 */

import { useState, useEffect } from "react";
import { productoService, categoriaService } from "../services/api";
import { generarReporteProductos } from "../services/pdfService";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [errores, setErrores] = useState([]);
    
    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
        categoria_id: ""
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [productosRes, categoriasRes] = await Promise.all([
                productoService.getAll(),
                categoriaService.getAll()
            ]);
            setProductos(productosRes.data);
            setCategorias(categoriasRes.data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            alert("Error al cargar los datos");
        } finally {
            setCargando(false);
        }
    };

    // ==================== MANEJO DEL FORMULARIO ====================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar errores al modificar
        setErrores([]);
    };

    const resetForm = () => {
        setFormData({
            nombre: "",
            precio: "",
            stock: "",
            descripcion: "",
            categoria_id: ""
        });
        setEditandoId(null);
        setErrores([]);
    };

    const abrirModalCrear = () => {
        resetForm();
        setMostrarModal(true);
    };

    const abrirModalEditar = (producto) => {
        setFormData({
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            descripcion: producto.descripcion || "",
            categoria_id: producto.categoria_id
        });
        setEditandoId(producto.id);
        setMostrarModal(true);
    };

    // ==================== CRUD OPERATIONS ====================
    const guardarProducto = async (e) => {
        e.preventDefault();
        setErrores([]);
        
        try {
            if (editandoId) {
                await productoService.update(editandoId, formData);
                alert("✅ Producto actualizado exitosamente");
            } else {
                await productoService.create(formData);
                alert("✅ Producto creado exitosamente");
            }
            setMostrarModal(false);
            cargarDatos();
            resetForm();
        } catch (error) {
            console.error("Error al guardar:", error);
            if (error.response?.data?.errores) {
                setErrores(error.response.data.errores);
            } else {
                alert("Error al guardar el producto");
            }
        }
    };

    const eliminarProducto = async (id, nombre) => {
        if (confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
            try {
                await productoService.delete(id);
                alert("✅ Producto eliminado exitosamente");
                cargarDatos();
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("Error al eliminar el producto");
            }
        }
    };

    // ==================== REPORTE PDF ====================
    const generarPDF = () => {
        if (productos.length === 0) {
            alert("No hay productos para generar el reporte");
            return;
        }
        generarReporteProductos(productos, "Reporte de Productos - Panadería");
    };

    if (cargando) {
        return <div style={{ textAlign: "center", padding: "50px" }}>
            <div className="spinner"></div>
            <p>Cargando productos...</p>
        </div>;
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>🍞 Productos</h1>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-primary" onClick={generarPDF}>
                        📄 Generar PDF
                    </button>
                    <button className="btn-primary" onClick={abrirModalCrear}>
                        + Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>${parseFloat(producto.precio).toFixed(2)}</td>
                                <td>{producto.stock}</td>
                                <td>{producto.categoria_nombre}</td>
                                <td>
                                    <button className="btn-sm btn-secondary" onClick={() => abrirModalEditar(producto)}>
                                        Editar
                                    </button>
                                    <button className="btn-sm btn-danger" style={{ marginLeft: "8px" }} onClick={() => eliminarProducto(producto.id, producto.nombre)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {productos.length === 0 && (
                    <p style={{ textAlign: "center", padding: "30px" }}>No hay productos registrados</p>
                )}
            </div>

            {/* MODAL PARA CREAR/EDITAR PRODUCTO */}
            {mostrarModal && (
                <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editandoId ? "Editar Producto" : "Nuevo Producto"}</h2>
                            <button className="modal-close" onClick={() => setMostrarModal(false)}>✕</button>
                        </div>
                        
                        {errores.length > 0 && (
                            <div className="error-list">
                                {errores.map((err, idx) => (
                                    <div key={idx} className="error-item">⚠️ {err}</div>
                                ))}
                            </div>
                        )}
                        
                        <form onSubmit={guardarProducto}>
                            <div className="form-group">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Pan Francés"
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio *</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0.01"
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Stock *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Categoría *</label>
                                <select
                                    name="categoria_id"
                                    value={formData.categoria_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Descripción del producto (opcional)"
                                />
                            </div>
                            
                            <div className="modal-buttons">
                                <button type="button" className="btn-secondary" onClick={() => setMostrarModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editandoId ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Productos;