import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificamos si existe un token en sessionStorage
    const token = sessionStorage.getItem("token");

    if (!token) {
      // Si no hay token, redirigimos al login
      navigate("/");
    }
  }, [navigate]);

  // Función para navegar a las páginas
  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          padding: "30px",
          backgroundColor: "#f4f6f9",
          borderRadius: "8px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "600",
            marginBottom: "20px",
          }}
        >
          Dashboard Administrador
        </h1>
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "30px" }}>
          Seleccione una de las siguientes opciones para gestionar el sistema.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div style={buttonStyle} onClick={() => navigateTo("/filtros")}>
            <h3>Gestión de FILTROS</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  textAlign: "center",
};

export default AdminDashboard;
