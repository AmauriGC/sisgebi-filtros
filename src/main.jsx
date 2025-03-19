import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Form from "./Form";
import Forgot from "./Forgot";

import Admin from "./pages/views/Admin/AdminDashboard";
import Responsable from "./pages/views/Responsable/ResponsablesDashboard";
import Becario from "./pages/views/Becario/BecarioDashboard";

import Bienes from "./pages/views/Admin/Bienes";
import Usuarios from "./pages/views/Admin/Usuarios";
import Areas from "./pages/views/Admin/Areas";
import Tipos from "./pages/views/Admin/Tipos";
import Marcas from "./pages/views/Admin/Marcas";
import Modelos from "./pages/views/Admin/Modelos";
import Asignaciones from "./pages/views/Admin/Asignaciones";

import BienesBecario from "./pages/views/Becario/BienesBecario";
import MisAsignaciones from "./pages/views/Becario/MisAsignaciones";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/form" element={<Form />} />
      <Route path="/forgot" element={<Forgot />} />

      <Route path="/admin-dashboard" element={<Admin />} />
      <Route path="/bienes" element={<Bienes />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/areas" element={<Areas />} />
      <Route path="/tipos" element={<Tipos />} />
      <Route path="/marcas" element={<Marcas />} />
      <Route path="/modelos" element={<Modelos />} />
      <Route path="/asignaciones" element={<Asignaciones />} />

      <Route path="/responsable-dashboard" element={<Responsable />} />

      <Route path="/becario-dashboard" element={<Becario />} />
      <Route path="/bienesBecario" element={<BienesBecario />} />
      <Route path="/misAsignaciones" element={<MisAsignaciones />} />
    </Routes>
  </Router>
);
