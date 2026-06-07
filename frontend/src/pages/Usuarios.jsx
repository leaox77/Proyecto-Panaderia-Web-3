/**
 * Página de gestión de usuarios (SOLO ADMIN)
 * NOTA: Este es un esqueleto - la funcionalidad completa se hará EN VIVO
 */

import { useState, useEffect } from "react";
import { usuarioService } from "../services/api";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const response = await usuarioService.getAll();
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return <div style={{ textAlign: "center", padding: "50px" }}>Cargando usuarios...</div>;
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>👥 Usuarios</h1>
                <button className="btn-primary">+ Nuevo Usuario</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.rol_nombre}</td>
                                <td>{usuario.estado === 1 ? "✅ Activo" : "❌ Inactivo"}</td>
                                <td>
                                    <button className="btn-sm btn-secondary">Editar</button>
                                    <button className="btn-sm btn-danger" style={{ marginLeft: "8px" }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {usuarios.length === 0 && (
                    <p style={{ textAlign: "center", padding: "30px" }}>No hay usuarios registrados</p>
                )}
            </div>
        </div>
    );
}

export default Usuarios;