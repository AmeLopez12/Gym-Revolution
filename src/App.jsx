import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // ¡Importante para los estilos!

// Importa tus componentes
import MainLayout from './layouts/MainLayout';
import Actividades from './pages/Actividades';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Aquí defines qué se ve al inicio */}
          <Route index element={<Actividades />} />
          <Route path="actividades" element={<Actividades />} />
          <Route path="socios" element={<div>Sección de Socios</div>} />
          <Route path="instructores" element={<div>Sección de Instructores</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;