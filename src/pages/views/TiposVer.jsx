import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const TipoBienVer = () => {
  const [tipoBienes, setTipoBienes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  useEffect(() => {
    obtenerTipoBienes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroStatus]);

  const obtenerTipoBienes = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/tipo-bien", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTipoBienes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de bien:", error);
        window.location.href = "/";
      });
  };

  const aplicarFiltros = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;

    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/tipo-bien/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        setTipoBienes(response.data);
      })
      .catch((error) => {
        console.error("Error al filtrar los tipos de bien:", error);
        if (error.response && error.response.status === 403) {
          window.location.href = "/";
        }
      });
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
    obtenerTipoBienes();
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f4f6f9", borderRadius: "8px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "600", marginBottom: "20px" }}>Ver Tipos de Bien</h1>
      <div>
        <h3>Filtrar Tipos de Bien</h3>
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
          <button onClick={resetearFiltros} style={{ ...buttonStyle, backgroundColor: "#e0e0e0" }}>Resetear Filtros</button>
          <button onClick={() => navigate("/usuarios")} style={{ ...buttonStyle, backgroundColor: "#ff5353" }}>Regresar</button>
        </div>
      </div>
      <h3>Tipos de Bien Registrados</h3>
      <div>
        {tipoBienes.length === 0 ? (
          <p>No hay tipos de bien que mostrar.</p>
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
              {tipoBienes.map((tipo) => (
                <tr key={tipo.tipoBienId}>
                  <td>{tipo.tipoBienId}</td>
                  <td>{tipo.nombreTipoBien}</td>
                  <td>{tipo.status}</td>
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

export default TipoBienVer;
