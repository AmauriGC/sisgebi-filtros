import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Select from "react-select";
import edit from "../assets/img/pencil.svg";
import drop from "../assets/img/delete.svg";
import Sidebar from "../components/Sidebar";

const Marcas = () => {
  const [marcas, setMarcas] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [openModalCrear, setOpenModalCrear] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [nuevaMarca, setNuevaMarca] = useState({
    nombreMarca: "",
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

    // Obtener marcas
    axios
      .get("http://localhost:8080/api/marca", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMarcas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las marcas:", error);
      });
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [filtroStatus]);

  const applyFilters = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
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
      });
  };

  const resetFilters = () => {
    setFiltroStatus(null);
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
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
      });
  };

  const handleCrearMarca = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const marcaParaEnviar = {
      nombreMarca: nuevaMarca.nombreMarca,
      status: nuevaMarca.status,
    };

    axios
      .post("http://localhost:8080/api/marca", marcaParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMarcas([...marcas, response.data]);
        setOpenModalCrear(false);
        setNuevaMarca({
          nombreMarca: "",
          status: "ACTIVO",
        });
      })
      .catch((error) => {
        console.error("Hubo un error al crear la marca:", error);
      });
    window.location.reload();
  };

  const handleEditarMarca = (marca) => {
    setMarcaSeleccionada(marca);
    setOpenModalEditar(true);
  };

  const handleActualizarMarca = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !marcaSeleccionada) return;

    const marcaParaEnviar = {
      nombreMarca: marcaSeleccionada.nombreMarca,
      status: marcaSeleccionada.status,
    };

    axios
      .put(`http://localhost:8080/api/marca/${marcaSeleccionada.marcaId}`, marcaParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMarcas(marcas.map((marca) => (marca.marcaId === marcaSeleccionada.marcaId ? response.data : marca)));
        setOpenModalEditar(false);
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar la marca:", error);
      });
  };

  const handleEliminarMarca = (id) => {
    const marca = marcas.find((marca) => marca.marcaId === id);
    setMarcaSeleccionada(marca);
    setOpenModalEliminar(true);
  };

  const confirmarEliminarMarca = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !marcaSeleccionada) return;

    axios
      .delete(`http://localhost:8080/api/marca/${marcaSeleccionada.marcaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMarcas(marcas.filter((marca) => marca.marcaId !== marcaSeleccionada.marcaId));
        setOpenModalEliminar(false);
      })
      .catch((error) => {
        console.error("Hubo un error al eliminar la marca:", error);
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
    { id: "marcaId", label: "ID", minWidth: 50 },
    { id: "nombreMarca", label: "Nombre", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 100 },
    { id: "editar", label: "Editar", minWidth: 50 },
    { id: "eliminar", label: "Eliminar", minWidth: 50 },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear marca */}
      <Modal
        open={openModalCrear}
        onClose={() => setOpenModalCrear(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear Marca
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCrearMarca();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Nombre de la Marca:</label>
                  <input
                    type="text"
                    value={nuevaMarca.nombreMarca}
                    onChange={(e) => setNuevaMarca({ ...nuevaMarca, nombreMarca: e.target.value })}
                    required
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Estado:</label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === nuevaMarca.status)}
                    onChange={(selected) => setNuevaMarca({ ...nuevaMarca, status: selected.value })}
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

      {/* Modal para editar marca */}
      <Modal
        open={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Editar Marca
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleActualizarMarca();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Nombre de la Marca:</label>
                  <input
                    type="text"
                    value={marcaSeleccionada?.nombreMarca || ""}
                    onChange={(e) =>
                      setMarcaSeleccionada({
                        ...marcaSeleccionada,
                        nombreMarca: e.target.value,
                      })
                    }
                    required
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Estado:</label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === marcaSeleccionada?.status)}
                    onChange={(selected) =>
                      setMarcaSeleccionada({
                        ...marcaSeleccionada,
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

      {/* Modal para eliminar marca */}
      <Modal
        open={openModalEliminar}
        onClose={() => setOpenModalEliminar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminar Marca
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar esta marca?
            <br />
            <button onClick={confirmarEliminarMarca}>Confirmar</button>
            <button onClick={() => setOpenModalEliminar(false)}>Cancelar</button>
          </Typography>
        </Box>
      </Modal>

      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <Paper sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #C77AAB" }}>
            <h3>Marcas Registradas</h3>
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
                {marcas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((marca) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={marca.marcaId}>
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
                                onClick={() => handleEditarMarca(marca)}
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
                                onClick={() => handleEliminarMarca(marca.marcaId)}
                              />
                            </TableCell>
                          );
                        } else {
                          const value = marca[column.id];
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
            count={marcas.length}
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

export default Marcas;
