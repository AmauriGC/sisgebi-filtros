import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const MarcaVer = () => {
  const [marcas, setMarcas] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/marca", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMarcas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las marcas:", error);
        window.location.href = "/";
      });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filtroStatus]);

  const applyFilters = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;

    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/marca/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        setMarcas(response.data);
      })
      .catch((error) => {
        console.error("Error al filtrar las marcas:", error);
        if (error.response && error.response.status === 403) {
          window.location.href = "/";
        }
      });
  };

  const resetFilters = () => {
    setFiltroStatus(null);
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    axios
      .get("http://localhost:8080/api/marca", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMarcas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las marcas:", error);
        window.location.href = "/";
      });
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f4f6f9",
        borderRadius: "8px",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: "600", marginBottom: "20px" }}>
        Ver Marcas
      </h1>
      <div>
        <h3>Filtrar Marcas</h3>
        <div>
          <Select
            placeholder="Selecciona un estado"
            value={filtroStatus}
            onChange={setFiltroStatus}
            options={statusOptions}
            styles={customSelectStyles}
          />
        </div>
        <div>
          <button
            onClick={resetFilters}
            style={{ ...buttonStyle, backgroundColor: "#e0e0e0" }}
          >
            Resetear Filtros
          </button>
          <button
            onClick={() => navigate("/usuarios")}
            style={{ ...buttonStyle, backgroundColor: "#ff5353" }}
          >
            Regresar
          </button>
        </div>
      </div>
      <h3>Marcas Registradas</h3>
      <div>
        {marcas.length === 0 ? (
          <p>No hay marcas que mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {marcas.map((marca) => (
                <tr key={marca.marcaId}>
                  <td>{marca.marcaId}</td>
                  <td>{marca.nombreMarca}</td>
                  <td>{marca.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
  marginRight: "10px",
  transition: "background-color 0.3s ease",
};

const customSelectStyles = {
  control: (base) => ({
    ...base,
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
  }),
};

export default MarcaVer;
