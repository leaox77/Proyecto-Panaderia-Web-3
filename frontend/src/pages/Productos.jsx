/**
 * Página de gestión de productos
 * NOTA: Este es un esqueleto - la funcionalidad completa se hará EN VIVO
 */

import { useState, useEffect } from "react";
import { productoService } from "../services/api";

function Productos() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const response = await productoService.getAll();
            setProductos(response.data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return <div style={{ textAlign: "center", padding: "50px" }}>Cargando productos...</div>;
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>🍞 Productos</h1>
                <button className="btn-primary">+ Nuevo Producto</button>
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
                                <td>${producto.precio}</td>
                                <td>{producto.stock}</td>
                                <td>{producto.categoria_nombre}</td>
                                <td>
                                    <button className="btn-sm btn-secondary">Editar</button>
                                    <button className="btn-sm btn-danger" style={{ marginLeft: "8px" }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {productos.length === 0 && (
                    <p style={{ textAlign: "center", padding: "30px" }}>No hay productos registrados</p>
                )}
            </div>
        </div>
    );
}

export default Productos;