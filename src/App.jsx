import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MahasiswaDashboard from './pages/dashboard/mahasiswa/MahasiswaDashboard';
import DosenDashboard from './pages/dashboard/dosen/DosenDashboard';
import MitraDashboard from './pages/dashboard/MitraDashboard';
import KaprodiDashboard from './pages/dashboard/KaprodiDashboard';
import './App.css';

// Proteksi Rute (Harus Login dan Peran Sesuai)
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirect ke login jika belum masuk
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    // Redirect ke dashboard milik perannya jika salah peran
    return <Navigate to={`/dashboard/${currentUser.role}`} replace />;
  }

  return children;
};

// Pengalihan Rute Default
const HomeRedirect = () => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to={`/dashboard/${currentUser.role}`} replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rute Autentikasi */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rute Terproteksi Dashboard */}
          <Route
            path="/dashboard/mahasiswa"
            element={
              <ProtectedRoute allowedRole="mahasiswa">
                <MahasiswaDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/dosen"
            element={
              <ProtectedRoute allowedRole="dosen">
                <DosenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/mitra"
            element={
              <ProtectedRoute allowedRole="mitra">
                <MitraDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/kaprodi"
            element={
              <ProtectedRoute allowedRole="kaprodi">
                <KaprodiDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Pengalihan */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
