import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Form from "./pages/Form";
import Forgot from "./pages/Forgot";
import Admin from "./pages/AdminDashboard";

import Perfil from "./pages/Perfil";
import Bienes from "./pages/Bienes";
import Usuarios from "./pages/Usuarios";
import Areas from "./pages/Areas";
import Tipos from "./pages/Tipos";
import Marcas from "./pages/Marcas";
import Modelos from "./pages/Modelos";
import Asignaciones from "./pages/Asignaciones";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/form" element={<Form />} />
      <Route path="/forgot" element={<Forgot />} />

      <Route path="/admin-dashboard" element={<Admin />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/bienes" element={<Bienes />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/areas" element={<Areas />} />
      <Route path="/tipos" element={<Tipos />} />
      <Route path="/marcas" element={<Marcas />} />
      <Route path="/modelos" element={<Modelos />} />
      <Route path="/asignaciones" element={<Asignaciones />} />
    </Routes>
  </Router>
);
