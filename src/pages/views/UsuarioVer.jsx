import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const UsuarioVer = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroRol, setFiltroRol] = useState(null);
  const [filtroLugar, setFiltroLugar] = useState(null);
  const [lugarOptions, setLugarOptions] = useState([]);

  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const rolOptions = [
    { value: "ADMINISTRADOR", label: "Administrador" },
    { value: "RESPONSABLE", label: "Responsable" },
    { value: "BECARIO", label: "Becario" },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los usuarios:", error);
        window.location.href = "/";
      });

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
        console.error("Hubo un error al obtener los lugares:", error);
        window.location.href = "/";
      });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filtroStatus, filtroRol, filtroLugar]);

  const applyFilters = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;
    if (filtroRol) params.rol = filtroRol.value;
    if (filtroLugar) params.lugar = filtroLugar.value;

    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("No se encontró un token válido.");
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/usuarios/filter", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al filtrar los usuarios:", error);
        if (error.response && error.response.status === 403) {
          console.error("Token no válido, redirigiendo al login.");
          window.location.href = "/";
        }
      });
  };

  const resetFilters = () => {
    setFiltroStatus(null);
    setFiltroRol(null);
    setFiltroLugar(null);
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    axios
      .get("http://localhost:8080/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los usuarios:", error);
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
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "600",
          marginBottom: "20px",
        }}
      >
        Ver Usuarios
      </h1>

      <div>
        <h3>Filtrar Usuarios</h3>
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
          <Select
            placeholder="Selecciona un rol"
            value={filtroRol}
            onChange={setFiltroRol}
            options={rolOptions}
            styles={customSelectStyles}
          />
        </div>
        <div>
          <Select
            placeholder="Selecciona un lugar"
            value={filtroLugar}
            onChange={setFiltroLugar}
            options={lugarOptions}
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
            onClick={() => navigate("/usuarios")} // Aquí usamos navigate directamente
            style={{ ...buttonStyle, backgroundColor: "#ff5353" }}
          >
            Regresar
          </button>
        </div>
      </div>

      <h3>Usuarios Registrados</h3>
      <div>
        {usuarios.length === 0 ? (
          <p>No hay usuarios que mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Rol</th>
                <th>Status</th>
                <th>Lugar</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombres}</td>
                  <td>{usuario.apellidos}</td>
                  <td>{usuario.rol}</td>
                  <td>{usuario.status}</td>
                  <td>{usuario.lugar}</td>
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

export default UsuarioVer;
