import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const AreaVer = () => {
  const [areas, setAreas] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroResponsable, setFiltroResponsable] = useState(null);
  const [filtroArea, setFiltroArea] = useState(null);
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

    // Obtener todas las áreas comunes
    axios
      .get("http://localhost:8080/api/areas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAllAreas(response.data);
        setAreas(response.data); // Inicialmente mostrar todas las áreas
      })
      .catch((error) => {
        console.error("Error al obtener las áreas comunes:", error);
      });

    // Obtener los responsables
    axios
      .get("http://localhost:8080/api/usuarios/responsables", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setResponsables(
          response.data.map((responsable) => ({
            value: responsable.id, 
            label: `${responsable.nombres} ${responsable.apellidos}`,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al obtener los responsables:", error);
      });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filtroStatus, filtroResponsable, filtroArea]);

  const applyFilters = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;
    if (filtroResponsable) params.responsableId = filtroResponsable.value;
    if (filtroArea) params.areaId = filtroArea.value;

    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }

    axios
      .get("http://localhost:8080/api/areas/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error al filtrar las áreas comunes:", error);
      });
  };

  const resetFilters = () => {
    setFiltroStatus(null);
    setFiltroResponsable(null);
    setFiltroArea(null);
    setAreas(allAreas); // Mostrar todas las áreas cuando se resetean los filtros
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f4f6f9", borderRadius: "8px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "600", marginBottom: "20px" }}>Ver Áreas Comunes</h1>
      <div>
        <h3>Filtrar Áreas</h3>
        <div>
          <Select
            placeholder="Selecciona un estado"
            value={filtroStatus}
            onChange={setFiltroStatus}
            options={statusOptions}
            styles={customSelectStyles}
          />
          <Select
            placeholder="Selecciona un responsable"
            value={filtroResponsable}
            onChange={setFiltroResponsable}
            options={responsables}
            styles={customSelectStyles}
          />
          <Select
            placeholder="Selecciona un área"
            value={filtroArea}
            onChange={setFiltroArea}
            options={allAreas.map((area) => ({
              value: area.areaId,
              label: area.nombreArea,
            }))}
            styles={customSelectStyles}
          />
        </div>
        <div>
          <button onClick={resetFilters} style={{ ...buttonStyle, backgroundColor: "#e0e0e0" }}>Resetear Filtros</button>
          <button onClick={() => navigate("/filtros")} style={{ ...buttonStyle, backgroundColor: "#ff5353" }}>Regresar</button>
        </div>
      </div>
      <h3>Áreas Registradas</h3>
      <div>
        {areas.length === 0 ? (
          <p>No hay áreas comunes que mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Responsable</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.areaId}>
                  <td>{area.areaId}</td>
                  <td>{area.nombreArea}</td>
                  <td>{area.responsable ? `${area.responsable.nombres} ${area.responsable.apellidos}` : "No asignado"}</td>
                  <td>{area.status}</td>
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

export default AreaVer;
