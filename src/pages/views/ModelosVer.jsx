import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const ModeloVer = () => {
  const [modelos, setModelos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroMarca, setFiltroMarca] = useState(null);
  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }

    axios
      .get("http://localhost:8080/api/modelo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModelos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los modelos:", error);
      });

    axios
      .get("http://localhost:8080/api/marca", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMarcas(
          response.data.map((marca) => ({
            value: marca.marcaId,
            label: marca.nombreMarca,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener las marcas:", error);
      });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filtroStatus, filtroMarca]);

  const applyFilters = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;
    if (filtroMarca) params.marcaId = filtroMarca.value;

    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/modelo/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        setModelos(response.data);
      })
      .catch((error) => {
        console.error("Error al filtrar los modelos:", error);
      });
  };

  const resetFilters = () => {
    setFiltroStatus(null);
    setFiltroMarca(null);
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    axios
      .get("http://localhost:8080/api/modelo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModelos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los modelos:", error);
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
        Ver Modelos
      </h1>
      <div>
        <h3>Filtrar Modelos</h3>
        <div>
          <Select
            placeholder="Selecciona un estado"
            value={filtroStatus}
            onChange={setFiltroStatus}
            options={statusOptions}
            styles={customSelectStyles}
          />
          <Select
            placeholder="Selecciona una marca"
            value={filtroMarca}
            onChange={setFiltroMarca}
            options={marcas}
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
      <h3>Modelos Registrados</h3>
      <div>
        {modelos.length === 0 ? (
          <p>No hay modelos que mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {modelos.map((modelo) => (
                <tr key={modelo.modeloId}>
                  <td>{modelo.modeloId}</td>
                  <td>{modelo.nombreModelo}</td>
                  <td>{modelo.marca.nombreMarca}</td>
                  <td>{modelo.status}</td>
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

export default ModeloVer;
