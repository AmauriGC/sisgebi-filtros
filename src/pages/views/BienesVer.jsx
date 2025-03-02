import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const BienVer = () => {
  const [bienes, setBienes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState(null);
  const [filtroAreaComun, setFiltroAreaComun] = useState(null);
  const [filtroTipoBien, setFiltroTipoBien] = useState(null);
  const [filtroMarca, setFiltroMarca] = useState(null);
  const [filtroModelo, setFiltroModelo] = useState(null);

  const [areaComunOptions, setAreaComunOptions] = useState([]);
  const [tipoBienOptions, setTipoBienOptions] = useState([]);
  const [marcaOptions, setMarcaOptions] = useState([]);
  const [modeloOptions, setModeloOptions] = useState([]);

  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const disponibilidadOptions = [
    { value: "DISPONIBLE", label: "Disponible" },
    { value: "OCUPADO", label: "Ocupado" },
  ];

  useEffect(() => {
    obtenerBienes();
    cargarOpcionesFiltros();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [
    filtroStatus,
    filtroDisponibilidad,
    filtroAreaComun,
    filtroTipoBien,
    filtroMarca,
    filtroModelo,
  ]);

  const obtenerBienes = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }

    axios
      .get("http://localhost:8080/api/bienes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBienes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los bienes:", error);
      });
  };

  const cargarOpcionesFiltros = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }

    // Cargar áreas comunes
    axios
      .get("http://localhost:8080/api/areas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAreaComunOptions(
          response.data.map((area) => ({
            value: area.areaId,
            label: area.nombreArea,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar áreas comunes:", error);
      });

    // Cargar tipos de bien
    axios
      .get("http://localhost:8080/api/tipo-bien", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTipoBienOptions(
          response.data.map((tipo) => ({
            value: tipo.tipoBienId,
            label: tipo.nombreTipoBien,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar tipos de bien:", error);
      });

    // Cargar marcas
    axios
      .get("http://localhost:8080/api/marca", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMarcaOptions(
          response.data.map((marca) => ({
            value: marca.marcaId,
            label: marca.nombreMarca,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar marcas:", error);
      });

    // Cargar modelos
    axios
      .get("http://localhost:8080/api/modelo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModeloOptions(
          response.data.map((modelo) => ({
            value: modelo.modeloId,
            label: modelo.nombreModelo,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar modelos:", error);
      });
  };

  const aplicarFiltros = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;
    if (filtroDisponibilidad)
      params.disponibilidad = filtroDisponibilidad.value;
    if (filtroAreaComun) params.areaComunId = filtroAreaComun.value;
    if (filtroTipoBien) params.tipoBienId = filtroTipoBien.value;
    if (filtroMarca) params.marcaId = filtroMarca.value;
    if (filtroModelo) params.modeloId = filtroModelo.value;

    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }

    axios
      .get("http://localhost:8080/api/bienes/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        setBienes(response.data);
      })
      .catch((error) => {
        console.error("Error al filtrar los bienes:", error);
      });
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
    setFiltroDisponibilidad(null);
    setFiltroAreaComun(null);
    setFiltroTipoBien(null);
    setFiltroMarca(null);
    setFiltroModelo(null);
    obtenerBienes();
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
        Ver Bienes
      </h1>
      <div>
        <h3>Filtrar Bienes</h3>
        <div>
          <Select
            placeholder="Selecciona un estado"
            value={filtroStatus}
            onChange={setFiltroStatus}
            options={statusOptions}
            styles={customSelectStyles}
          />
          <Select
            placeholder="Selecciona una disponibilidad"
            value={filtroDisponibilidad}
            onChange={setFiltroDisponibilidad}
            options={disponibilidadOptions}
            styles={customSelectStyles}
          />
          <Select
            placeholder="Selecciona un área común"
            value={filtroAreaComun}
            onChange={setFiltroAreaComun}
            options={areaComunOptions}
            styles={customSelectStyles}
          />
          <Select
            placeholder="Selecciona un tipo de bien"
            value={filtroTipoBien}
            onChange={setFiltroTipoBien}
            options={tipoBienOptions}
            styles={customSelectStyles}
          />
          <Select
            placeholder="Selecciona una marca"
            value={filtroMarca}
            onChange={setFiltroMarca}
            options={marcaOptions}
            styles={customSelectStyles}
          />
          <Select
            placeholder="Selecciona un modelo"
            value={filtroModelo}
            onChange={setFiltroModelo}
            options={modeloOptions}
            styles={customSelectStyles}
          />
        </div>
        <div>
          <button
            onClick={resetearFiltros}
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
      <h3>Bienes Registrados</h3>
      <div>
        {bienes.length === 0 ? (
          <p>No hay bienes que mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Número de Serie</th>
                <th>Tipo de Bien</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Área Común</th>
                <th>Estado</th>
                <th>Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              {bienes.map((bien) => (
                <tr key={bien.idBien}>
                  <td>{bien.idBien}</td>
                  <td>{bien.codigo}</td>
                  <td>{bien.numeroSerie}</td>
                  <td>{bien.tipoBien?.nombreTipoBien}</td>
                  <td>{bien.marca?.nombreMarca}</td>
                  <td>{bien.modelo?.nombreModelo}</td>
                  <td>{bien.areaComun?.nombreArea}</td>
                  <td>{bien.status}</td>
                  <td>{bien.disponibilidad}</td>
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

export default BienVer;
