import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./Login";
import AdminDashboard from "./pages/AdminDashboard";
import Usuarios from "./pages/Usuarios";
import Filtros from "./pages/Filtros";

// Vistas de usuarios";
import UsuarioVer from "./pages/views/UsuarioVer";
import MarcasVer from "./pages/views/MarcasVer";
import ModeloVer from "./pages/views/ModelosVer";
import AreasVer from "./pages/views/AreasVer";
import TipoBienVer from "./pages/views/TiposVer";
import Bienes from "./pages/views/BienesVer";
import AsignacionesVer from "./pages/views/AsignacionesVer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/filtros" element={<Filtros />} />


      {/* Rutas de usuarios */}
      <Route path="/usuarios/ver" element={<UsuarioVer />} />
      <Route path="/marcas/ver" element={<MarcasVer />} />
      <Route path="/modelos/ver" element={<ModeloVer />} />
      <Route path="/areas/ver" element={<AreasVer />} />
      <Route path="/tipos/ver" element={<TipoBienVer />} />
      <Route path="/bienes/ver" element={<Bienes />} />
      <Route path="/asignaciones/ver" element={<AsignacionesVer />} />
    </Routes>
  </Router>
);
