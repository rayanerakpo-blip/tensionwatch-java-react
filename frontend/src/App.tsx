import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patient from './pages/Patient';
import Tension from './pages/Tension';
import Medicaments from './pages/Medicaments';
import Effets from './pages/Effets';
import Rappels from './pages/Rappels';
import Urgences from './pages/Urgences';
import Compte from './pages/Compte';
import Conseils from './pages/Conseils';
import Export from './pages/Export';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/patient" element={<PrivateRoute><Patient /></PrivateRoute>} />
          <Route path="/tension" element={<PrivateRoute><Tension /></PrivateRoute>} />
          <Route path="/medicaments" element={<PrivateRoute><Medicaments /></PrivateRoute>} />
          <Route path="/effets" element={<PrivateRoute><Effets /></PrivateRoute>} />
          <Route path="/rappels" element={<PrivateRoute><Rappels /></PrivateRoute>} />
          <Route path="/urgences" element={<PrivateRoute><Urgences /></PrivateRoute>} />
          <Route path="/compte" element={<PrivateRoute><Compte /></PrivateRoute>} />
          <Route path="/conseils" element={<PrivateRoute><Conseils /></PrivateRoute>} />
          <Route path="/export" element={<PrivateRoute><Export /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
