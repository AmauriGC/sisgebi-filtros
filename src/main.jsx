import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Login from "./Login";
import Form from "./Form";

import Admin from "./pages/views/Admin/Perfil/AdminDashboard";
import Responsable from "./pages/views/Responsable/Perfil/ResponsablesDashboard";
import Becario from "./pages/views/Becario/Perfil/BecarioDashboard";

import Bienes from "./pages/views/Admin/Bienes/Bienes";
import Usuarios from "./pages/views/Admin/Usuarios/Usuarios";
import Areas from "./pages/views/Admin/Areas/Areas";
import Tipos from "./pages/views/Admin/Tipos/Tipos";
import Marcas from "./pages/views/Admin/Marcas/Marcas";
import Modelos from "./pages/views/Admin/Modelos/Modelos";
import Asignaciones from "./pages/views/Admin/Asignaciones/Asignaciones";

import BienesBecario from "./pages/views/Becario/Bienes/BienesBecario";
import MisAsignacionesBecario from "./pages/views/Becario/Asignaciones/MisAsignaciones";

import BienesResponsable from "./pages/views/Responsable/Bienes/BienesResponsable";
import MisAsignacionesResponsable from "./pages/views/Responsable/Asignaciones/MisAsignacionesResponsable";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      <Route path="/" element={<Form />} />

      <Route path="/admin-dashboard" element={<Admin />} />
      <Route path="/bienes" element={<Bienes />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/areas" element={<Areas />} />
      <Route path="/tipos" element={<Tipos />} />
      <Route path="/marcas" element={<Marcas />} />
      <Route path="/modelos" element={<Modelos />} />
      <Route path="/asignaciones" element={<Asignaciones />} />

      <Route path="/responsable-dashboard" element={<Responsable />} />
      <Route path="/bienesResponsable" element={<BienesResponsable />} />
      <Route path="/misAsignacionesResponsable" element={<MisAsignacionesResponsable />} />

      <Route path="/becario-dashboard" element={<Becario />} />
      <Route path="/bienesBecario" element={<BienesBecario />} />
      <Route path="/misAsignaciones" element={<MisAsignacionesBecario />} />
    </Routes>
  </Router>
);
