import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const AsignacionesVer = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroRol, setFiltroRol] = useState(null);
  const [filtroLugar, setFiltroLugar] = useState(null);
  const [filtroTipoBien, setFiltroTipoBien] = useState(null);
  const [filtroMarca, setFiltroMarca] = useState(null);
  const [filtroModelo, setFiltroModelo] = useState(null);
  const [filtroAreaComun, setFiltroAreaComun] = useState(null);

  const [lugarOptions, setLugarOptions] = useState([]);
  const [tipoBienOptions, setTipoBienOptions] = useState([]);
  const [marcaOptions, setMarcaOptions] = useState([]);
  const [modeloOptions, setModeloOptions] = useState([]);
  const [areaComunOptions, setAreaComunOptions] = useState([]);

  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const rolOptions = [
    { value: "RESPONSABLE", label: "Responsable" },
    { value: "BECARIO", label: "Becario" },
  ];

  useEffect(() => {
    obtenerAsignaciones();
    cargarOpcionesFiltros();
  }, [filtroStatus, filtroRol, filtroLugar, filtroTipoBien, filtroMarca, filtroModelo, filtroAreaComun]);

  // Obtener todas las asignaciones
  const obtenerAsignaciones = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }

    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;
    if (filtroRol) params.rol = filtroRol.value;
    if (filtroLugar) params.lugar = filtroLugar.value;
    if (filtroTipoBien) params.tipoBienId = filtroTipoBien.value;
    if (filtroMarca) params.marcaId = filtroMarca.value;
    if (filtroModelo) params.modeloId = filtroModelo.value;
    if (filtroAreaComun) params.areaComunId = filtroAreaComun.value;

    axios
      .get("http://localhost:8080/api/usuarios/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        const usuariosFiltrados = response.data;
        // Aquí filtramos las asignaciones según los usuarios filtrados y los bienes filtrados
        axios
          .get("http://localhost:8080/api/bienes/filter", {
            headers: { Authorization: `Bearer ${token}` },
            params,
          })
          .then((response) => {
            const bienesFiltrados = response.data;
            axios
              .get("http://localhost:8080/api/asignaciones", {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => {
                const asignacionesFiltradas = response.data.filter((asignacion) =>
                  usuariosFiltrados.some(
                    (usuario) => usuario.id === asignacion.usuario.id
                  ) && bienesFiltrados.some(
                    (bien) => bien.idBien === asignacion.bien.idBien
                  )
                );
                setAsignaciones(asignacionesFiltradas);
              })
              .catch((error) => {
                console.error("Error al obtener las asignaciones:", error);
              });
          })
          .catch((error) => {
            console.error("Error al filtrar los bienes:", error);
          });
      })
      .catch((error) => {
        console.error("Hubo un error al filtrar los usuarios:", error);
      });
  };

  const cargarOpcionesFiltros = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
    }

    // Cargar lugares
    axios
      .get("http://localhost:8080/api/usuarios/lugares", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const lugares = response.data.map((lugar) => ({
          value: lugar,
          label: lugar,
        }));
        setLugarOptions(lugares);
      })
      .catch((error) => {
        console.error("Error al cargar lugares:", error);
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
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
    setFiltroRol(null);
    setFiltroLugar(null);
    setFiltroTipoBien(null);
    setFiltroMarca(null);
    setFiltroModelo(null);
    setFiltroAreaComun(null);
    obtenerAsignaciones();
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
        Ver Asignaciones
      </h1>

      <h3>Filtrar Asignaciones</h3>
      <div>
        <Select
          placeholder="Selecciona un estado"
          value={filtroStatus}
          onChange={setFiltroStatus}
          options={statusOptions}
          styles={customSelectStyles}
        />
        <Select
          placeholder="Selecciona un rol"
          value={filtroRol}
          onChange={setFiltroRol}
          options={rolOptions}
          styles={customSelectStyles}
        />
        <Select
          placeholder="Selecciona un lugar"
          value={filtroLugar}
          onChange={setFiltroLugar}
          options={lugarOptions}
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
        <Select
          placeholder="Selecciona un área común"
          value={filtroAreaComun}
          onChange={setFiltroAreaComun}
          options={areaComunOptions}
          styles={customSelectStyles}
        />


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

      <h3>Asignaciones Registradas</h3>
      <div>
        {asignaciones.length === 0 ? (
          <p>No hay asignaciones que mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Código</th>
                <th>Número de Serie</th>
                <th>Tipo de Bien</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Área</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((asignacion) => (
                <tr key={asignacion.asignacionesId}>
                  <td>{asignacion.asignacionesId}</td>
                  <td>{asignacion.usuario.nombres}</td>
                  <td>{asignacion.usuario.rol}</td>
                  <td>{asignacion.bien?.codigo}</td>
                  <td>{asignacion.bien?.numeroSerie}</td>
                  <td>{asignacion.bien?.tipoBien?.nombreTipoBien}</td>
                  <td>{asignacion.bien?.marca?.nombreMarca}</td>
                  <td>{asignacion.bien?.modelo?.nombreModelo}</td>
                  <td>{asignacion.bien?.areaComun?.nombreArea}</td>
                  <td>{asignacion.status}</td>
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

export default AsignacionesVer;
