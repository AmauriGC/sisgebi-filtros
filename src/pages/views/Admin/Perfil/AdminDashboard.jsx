import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Sidebar from "../../../../components/Sidebar";

const AdminDashboard = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Verificar si es la primera visita
    const isFirstVisit = localStorage.getItem("firstVisit") === null;

    if (token) {
      if (isFirstVisit) {
        // Mostrar alerta de carga solo la primera vez
        Swal.fire({
          title: "Cargando datos...",
          text: "Por favor, espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      axios
        .get(`http://localhost:8080/api/usuarios/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUsuario(response.data);

          if (isFirstVisit) {
            // Cerrar la alerta de carga
            Swal.close();

            // Mostrar alerta de éxito solo la primera vez
            Swal.fire({
              icon: "success",
              title: "¡Bienvenido!",
              text: "Datos del usuario cargados correctamente.",
              showConfirmButton: false,
              timer: 1500,
            });

            // Marcar que ya no es la primera visita
            localStorage.setItem("firstVisit", "false");
          }
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);

          if (isFirstVisit) {
            // Cerrar la alerta de carga y mostrar alerta de error solo la primera vez
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudieron cargar los datos del usuario. Inténtalo de nuevo más tarde.",
              showConfirmButton: false,
              timer: 3000,
            });

            // Marcar que ya no es la primera visita
            localStorage.setItem("firstVisit", "false");
          }

          window.location.href = "/";
        });
    } else {
      if (isFirstVisit) {
        // Mostrar alerta si no hay token solo la primera vez
        Swal.fire({
          icon: "warning",
          title: "Acceso no autorizado",
          text: "Debes iniciar sesión para acceder a esta página.",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          // Redirigir al usuario a la página de inicio de sesión
          window.location.href = "/";
        });

        // Marcar que ya no es la primera visita
        localStorage.setItem("firstVisit", "false");
      }
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
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
              Perfil del Usuario
            </motion.h1>
            {/* Contenedor de dos columnas */}
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
              {/* Columna 1: Textos (etiquetas) */}
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

              {/* Columna 2: Datos obtenidos */}
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
            </motion.div>{" "}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: "18px", color: "#254B5E" }}
          >
            Cargando datos del usuario...
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
