import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Importación correcta
import Sidebar from "../../../components/Sidebar";

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
      <Sidebar />
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
          <div
            style={{
              backgroundColor: "#ffffff", // Fondo blanco
              borderRadius: "10px", // Bordes redondeados
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave
              padding: "30px",
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#254B5E", // Color del título
                textAlign: "center",
              }}
            >
              Perfil del Usuario
            </h1>

            {/* Contenedor de dos columnas */}
            <div
              style={{
                display: "flex",
                gap: "20px", // Espacio entre columnas
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              {/* Columna 1: Textos (etiquetas) */}
              <div
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
              </div>

              {/* Columna 2: Datos obtenidos */}
              <div
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
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: "18px", color: "#254B5E" }}>Cargando datos del usuario...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
