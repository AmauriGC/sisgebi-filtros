import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SidebarBecario from "../../../../components/SidebarBecario";

const BecarioDashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "Debes iniciar sesión para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    const role = decodedToken.role;

    if (role !== "BECARIO") {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "No tienes permiso para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    axios
      .get(`http://localhost:8080/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuario(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos del usuario. Inténtalo de nuevo más tarde.",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          navigate("/");
        });
      });
  }, [navigate]);

  return (
    <div style={{ display: "flex" }}>
      <SidebarBecario />

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        {usuario ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "30px",
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#254B5E",
                textAlign: "center",
              }}
            >
              Perfil del Becario
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  textAlign: "start",
                }}
              >
                <strong style={{ color: "#254B5E" }}>Nombres:</strong>
                <strong style={{ color: "#254B5E" }}>Apellidos:</strong>
                <strong style={{ color: "#254B5E" }}>Correo:</strong>
                <strong style={{ color: "#254B5E" }}>Lugar:</strong>
                <strong style={{ color: "#254B5E" }}>Rol:</strong>
                <strong style={{ color: "#254B5E" }}>Estado:</strong>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  textAlign: "start",
                }}
              >
                <span style={{ color: "#333" }}>{usuario.nombres}</span>
                <span style={{ color: "#333" }}>{usuario.apellidos}</span>
                <span style={{ color: "#333" }}>{usuario.correo}</span>
                <span style={{ color: "#333" }}>{usuario.lugar}</span>
                <span style={{ color: "#333" }}>{usuario.rol}</span>
                <span style={{ color: "#333" }}>{usuario.status}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: "18px", color: "#254B5E" }}
          >
            Cargando datos del becario...
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default BecarioDashboard;
