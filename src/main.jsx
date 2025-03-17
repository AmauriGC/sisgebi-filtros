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

import Bienes from "./pages/views/Admin/Bienes";
import Usuarios from "./pages/views/Admin/Usuarios";
import Areas from "./pages/views/Admin/Areas";
import Tipos from "./pages/views/Admin/Tipos";
import Marcas from "./pages/views/Admin/Marcas";
import Modelos from "./pages/views/Admin/Modelos";
import Asignaciones from "./pages/views/Admin/Asignaciones";

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
    </Routes>
  </Router>
);
