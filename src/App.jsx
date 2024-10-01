import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Interfas_user from './pages/Interfas_user';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Propietarios from './Secciones/Propietarios';
import Registro_sistema from './Secciones/Registro_sistema';
import Seguro_vehicular from './Secciones/Seguro_vehicular';
import Usuario from './Secciones/Usuarios';
import Bienvenida from './Secciones/Bienvenida';
import Asociaciones from './Secciones/Asociaciones';
import Vehiculos from './Secciones/Vehiculos';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Interfas_user />} />
            <Route path="/Login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/Dashboard" element={<Dashboard />}>
                <Route path="Propietarios" element={<Propietarios />} />
                <Route path="Registro_sistema" element={<Registro_sistema />} />
                <Route path="Seguro_vehicular" element={<Seguro_vehicular />} />
                <Route path="Asociaciones" element={<Asociaciones />} />
                <Route path="Bienvenida" element={<Bienvenida />} />
                <Route path="Usuario" element={<Usuario />} />
                <Route path="Vehiculos" element={<Vehiculos />} />
              </Route>
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
