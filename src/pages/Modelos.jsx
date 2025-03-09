import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

import edit from "../assets/img/pencil.svg";
import drop from "../assets/img/delete.svg";
import Sidebar from "../components/Sidebar";

const Modelos = () => {
  const [modelos, setModelos] = useState([]);
  const [marcaOptions, setMarcaOptions] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroMarca, setFiltroMarca] = useState(null);
  const [openModalCrear, setOpenModalCrear] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [nuevoModelo, setNuevoModelo] = useState({
    nombreModelo: "",
    marcaId: null,
    status: "ACTIVO",
  });

  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Obtener modelos
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

    // Obtener marcas
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
        console.error("Error al obtener las marcas:", error);
      });
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [filtroStatus, filtroMarca]);

  const applyFilters = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;
    if (filtroMarca) params.marcaId = filtroMarca.value;

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
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
      navigate("/");
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

  const handleCrearModelo = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const modeloParaEnviar = {
      nombreModelo: nuevoModelo.nombreModelo,
      marca: { marcaId: nuevoModelo.marcaId },
      status: nuevoModelo.status,
    };

    axios
      .post("http://localhost:8080/api/modelo", modeloParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModelos([...modelos, response.data]);
        setOpenModalCrear(false);
        setNuevoModelo({
          nombreModelo: "",
          marcaId: null,
          status: "ACTIVO",
        });
        window.location.reload();
      })
      .catch((error) => {
        console.error("Hubo un error al crear el modelo:", error);
      });
  };

  const handleEditarModelo = (modelo) => {
    setModeloSeleccionado({
      ...modelo,
      marcaId: modelo.marca ? modelo.marca.marcaId : null,
    });
    setOpenModalEditar(true);
  };

  const handleActualizarModelo = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !modeloSeleccionado) return;

    const modeloParaEnviar = {
      nombreModelo: modeloSeleccionado.nombreModelo,
      marca: { marcaId: modeloSeleccionado.marcaId },
      status: modeloSeleccionado.status,
    };

    axios
      .put(`http://localhost:8080/api/modelo/${modeloSeleccionado.modeloId}`, modeloParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModelos(modelos.map((modelo) => (modelo.modeloId === modeloSeleccionado.modeloId ? response.data : modelo)));
        setOpenModalEditar(false);
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el modelo:", error);
      });
  };

  const handleEliminarModelo = (id) => {
    const modelo = modelos.find((modelo) => modelo.modeloId === id);
    setModeloSeleccionado(modelo);
    setOpenModalEliminar(true);
  };

  const confirmarEliminarModelo = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !modeloSeleccionado) return;

    axios
      .delete(`http://localhost:8080/api/modelo/${modeloSeleccionado.modeloId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setModelos(modelos.filter((modelo) => modelo.modeloId !== modeloSeleccionado.modeloId));
        setOpenModalEliminar(false);
      })
      .catch((error) => {
        console.error("Hubo un error al eliminar el modelo:", error);
      });
    window.location.reload();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: "modeloId", label: "ID", minWidth: 50 },
    { id: "nombreModelo", label: "Nombre", minWidth: 100 },
    { id: "marca", label: "Marca", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 100 },
    { id: "editar", label: "Editar", minWidth: 50 },
    { id: "eliminar", label: "Eliminar", minWidth: 50 },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear modelo */}
      <Modal
        open={openModalCrear}
        onClose={() => setOpenModalCrear(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear Modelo
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCrearModelo();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Nombre del Modelo:</label>
                  <input
                    type="text"
                    value={nuevoModelo.nombreModelo}
                    onChange={(e) => setNuevoModelo({ ...nuevoModelo, nombreModelo: e.target.value })}
                    required
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Marca:</label>
                  <Select
                    options={marcaOptions}
                    value={marcaOptions.find((option) => option.value === nuevoModelo.marcaId)}
                    onChange={(selected) => setNuevoModelo({ ...nuevoModelo, marcaId: selected.value })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Estado:</label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === nuevoModelo.status)}
                    onChange={(selected) => setNuevoModelo({ ...nuevoModelo, status: selected.value })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Crear
                </button>
              </div>
            </form>
          </Typography>
        </Box>
      </Modal>

      {/* Modal para editar modelo */}
      <Modal
        open={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Editar Modelo
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleActualizarModelo();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Nombre del Modelo:</label>
                  <input
                    type="text"
                    value={modeloSeleccionado?.nombreModelo || ""}
                    onChange={(e) =>
                      setModeloSeleccionado({
                        ...modeloSeleccionado,
                        nombreModelo: e.target.value,
                      })
                    }
                    required
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Marca:</label>
                  <Select
                    options={marcaOptions}
                    value={marcaOptions.find((option) => option.value === modeloSeleccionado?.marcaId)}
                    onChange={(selected) =>
                      setModeloSeleccionado({
                        ...modeloSeleccionado,
                        marcaId: selected.value,
                      })
                    }
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Estado:</label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === modeloSeleccionado?.status)}
                    onChange={(selected) =>
                      setModeloSeleccionado({
                        ...modeloSeleccionado,
                        status: selected.value,
                      })
                    }
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </Typography>
        </Box>
      </Modal>

      {/* Modal para eliminar modelo */}
      <Modal
        open={openModalEliminar}
        onClose={() => setOpenModalEliminar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminar Modelo
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar este modelo?
            <br />
            <button onClick={confirmarEliminarModelo}>Confirmar</button>
            <button onClick={() => setOpenModalEliminar(false)}>Cancelar</button>
          </Typography>
        </Box>
      </Modal>

      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <Paper sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #C77AAB" }}>
            <h3>Modelos Registrados</h3>
            <p style={{ color: "#C77AAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {/* Filtros */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Select
                  placeholder="Estado"
                  value={filtroStatus}
                  onChange={setFiltroStatus}
                  options={statusOptions}
                  styles={customSelectStyles}
                />
                <Select
                  placeholder="Marca"
                  value={filtroMarca}
                  onChange={setFiltroMarca}
                  options={marcaOptions}
                  styles={customSelectStyles}
                />
                <button onClick={resetFilters} style={{ ...buttonStyle, backgroundColor: "#C77AAB" }}>
                  Borrar
                </button>
                <button onClick={() => setOpenModalCrear(true)} style={{ ...buttonStyle }}>
                  Crear
                </button>
              </div>
            </div>
          </Box>

          {/* Tabla */}
          <TableContainer sx={{ maxHeight: "50vh", width: "100%" }}>
            <Table aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        fontSize: "12px",
                        color: "#546EAB",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {modelos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((modelo) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={modelo.modeloId}>
                      {columns.map((column) => {
                        if (column.id === "editar") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <img
                                src={edit}
                                alt="Editar"
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleEditarModelo(modelo)}
                              />
                            </TableCell>
                          );
                        } else if (column.id === "eliminar") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <img
                                src={drop}
                                alt="Eliminar"
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleEliminarModelo(modelo.modeloId)}
                              />
                            </TableCell>
                          );
                        } else {
                          const value = column.id === "marca" ? modelo.marca?.nombreMarca : modelo[column.id];
                          return (
                            <TableCell key={column.id} align={column.align} style={{ fontSize: "10px" }}>
                              {value}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={modelos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#254B5E",
  padding: "8px",
  border: "none",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "14px",
  cursor: "pointer",
};

const customSelectStyles = {
  control: (base) => ({
    ...base,
    width: "160px",
    border: "none",
    fontSize: "12px ",
    backgroundColor: "#f0f0f0",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "10px",
    color: "#000",
    textAlign: "center",
  }),
  option: (base) => ({
    ...base,
    fontSize: "11px",
    color: "#000",
    textAlign: "start",
  }),
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

export default Modelos;
