/**
 * Página de gestión de categorías (SOLO ADMIN)
 * NOTA: Este es un esqueleto - la funcionalidad completa se hará EN VIVO
 */

import { useState, useEffect } from "react";
import { categoriaService } from "../services/api";

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            const response = await categoriaService.getAll();
            setCategorias(response.data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return <div style={{ textAlign: "center", padding: "50px" }}>Cargando categorías...</div>;
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>🏷️ Categorías</h1>
                <button className="btn-primary">+ Nueva Categoría</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Fecha Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td>{categoria.nombre}</td>
                                <td>{new Date(categoria.fecha_creacion).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn-sm btn-secondary">Editar</button>
                                    <button className="btn-sm btn-danger" style={{ marginLeft: "8px" }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categorias.length === 0 && (
                    <p style={{ textAlign: "center", padding: "30px" }}>No hay categorías registradas</p>
                )}
            </div>
        </div>
    );
}

export default Categorias;