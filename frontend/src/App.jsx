import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Usuarios from './pages/Usuarios';
import ProtectedRoute from './components/ProtectedRoute';
import { RoleBasedRoute, ROLES } from './components/RoleBasedRoute';
import Navbar from './components/Navbar';
import './App.css';

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
                {/* Rutas públicas */}
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                
                {/* Rutas protegidas */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/productos" element={
                    <ProtectedRoute>
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.EMPLEADO]}>
                            <Layout>
                                <Productos />
                            </Layout>
                        </RoleBasedRoute>
                    </ProtectedRoute>
                } />
                
                <Route path="/categorias" element={
                    <ProtectedRoute>
                        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                            <Layout>
                                <Categorias />
                            </Layout>
                        </RoleBasedRoute>
                    </ProtectedRoute>
                } />
                
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