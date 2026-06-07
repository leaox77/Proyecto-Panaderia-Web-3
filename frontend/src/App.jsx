/**
 * Componente principal de la aplicación
 * NOVEDAD: Rutas protegidas y manejo de roles
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Usuarios from './pages/Usuarios';
import ProtectedRoute from './components/ProtectedRoute';
import { RoleBasedRoute, ROLES } from './components/RoleBasedRoute';
import Navbar from './components/Navbar';
import './App.css';

/**
 * Layout que incluye la barra de navegación
 */
function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main className="dashboard-container">
                {children}
            </main>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta pública - Login */}
                <Route path="/" element={<Login />} />
                
                {/* Rutas protegidas (requieren autenticación) */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                {/* Productos - Accesible para Admin y Empleado */}
                <Route path="/productos" element={
                    <ProtectedRoute>
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLEADO]}>
                            <Layout>
                                <Productos />
                            </Layout>
                        </RoleBasedRoute>
                    </ProtectedRoute>
                } />
                
                {/* Categorías - Solo Admin */}
                <Route path="/categorias" element={
                    <ProtectedRoute>
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                            <Layout>
                                <Categorias />
                            </Layout>
                        </RoleBasedRoute>
                    </ProtectedRoute>
                } />
                
                {/* Usuarios - Solo Admin */}
                <Route path="/usuarios" element={
                    <ProtectedRoute>
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                            <Layout>
                                <Usuarios />
                            </Layout>
                        </RoleBasedRoute>
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;