import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // ¡Importante para los estilos!

import Socios from './pages/Socios';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Actividades from './pages/Actividades';
import Instructores from './pages/Instructores';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* INICIO */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="actividades" element={<Actividades />} />
          <Route path="socios" element={<Socios />} />
          <Route path="instructores" element={<Instructores />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;