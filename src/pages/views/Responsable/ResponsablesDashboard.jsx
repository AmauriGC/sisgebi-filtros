import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion"; // Importa Framer Motion
import SidebarResponsable from "../../../components/SidebarResponsable";

const AdminDashboard = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      // Decodifica el token para obtener el ID del usuario
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId; // Extrae el ID del usuario

      // Hace una solicitud al backend para obtener los detalles del usuario
      axios
        .get(`http://localhost:8080/api/usuarios/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUsuario(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
        });
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <SidebarResponsable />
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f5f5f5", // Fondo claro
        }}
      >
        {usuario ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }} // Estado inicial: invisible y desplazado hacia abajo
            animate={{ opacity: 1, y: 0 }} // Estado final: visible y en su posición
            transition={{ duration: 0.5 }} // Duración de la animación
            style={{
              backgroundColor: "#ffffff", // Fondo blanco
              borderRadius: "10px", // Bordes redondeados
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave
              padding: "30px",
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <motion.h1
              initial={{ opacity: 0, x: -50 }} // Título: invisible y desplazado a la izquierda
              animate={{ opacity: 1, x: 0 }} // Título: visible y en su posición
              transition={{ delay: 0.2, duration: 0.5 }} // Retraso y duración de la animación
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#254B5E", // Color del título
                textAlign: "center",
              }}
            >
              Perfil del Usuario
            </motion.h1>

            {/* Contenedor de dos columnas */}
            <motion.div
              initial={{ opacity: 0 }} // Contenedor: invisible inicialmente
              animate={{ opacity: 1 }} // Contenedor: visible
              transition={{ delay: 0.4, duration: 0.5 }} // Retraso y duración de la animación
              style={{
                display: "flex",
                gap: "20px", // Espacio entre columnas
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              {/* Columna 1: Textos (etiquetas) */}
              <motion.div
                initial={{ opacity: 0, x: -50 }} // Columna 1: invisible y desplazada a la izquierda
                animate={{ opacity: 1, x: 0 }} // Columna 1: visible y en su posición
                transition={{ delay: 0.6, duration: 0.5 }} // Retraso y duración de la animación
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px", // Espacio entre filas
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
                initial={{ opacity: 0, x: 50 }} // Columna 2: invisible y desplazada a la derecha
                animate={{ opacity: 1, x: 0 }} // Columna 2: visible y en su posición
                transition={{ delay: 0.8, duration: 0.5 }} // Retraso y duración de la animación
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px", // Espacio entre filas
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
            initial={{ opacity: 0 }} // Mensaje de carga: invisible inicialmente
            animate={{ opacity: 1 }} // Mensaje de carga: visible
            transition={{ duration: 0.5 }} // Duración de la animación
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
