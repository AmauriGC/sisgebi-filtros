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
import edit from "../../../assets/img/pencil.svg";
import drop from "../../../assets/img/delete.svg";
import Sidebar from "../../../components/Sidebar";

const Tipos = () => {
  const [tipoBienes, setTipoBienes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [openModalCrear, setOpenModalCrear] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [tipoBienSeleccionado, setTipoBienSeleccionado] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [nuevoTipoBien, setNuevoTipoBien] = useState({
    nombreTipoBien: "",
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

    // Obtener tipos de bien
    axios
      .get("http://localhost:8080/api/tipo-bien", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTipoBienes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de bien:", error);
      });
  }, [navigate]);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroStatus]);

  const aplicarFiltros = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
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
      });
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
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
      });
  };

  const handleCrearTipoBien = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const tipoBienParaEnviar = {
      nombreTipoBien: nuevoTipoBien.nombreTipoBien,
      status: nuevoTipoBien.status,
    };

    axios
      .post("http://localhost:8080/api/tipo-bien", tipoBienParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTipoBienes([...tipoBienes, response.data]);
        setOpenModalCrear(false);
        setNuevoTipoBien({
          nombreTipoBien: "",
          status: "ACTIVO",
        });
      })
      .catch((error) => {
        console.error("Hubo un error al crear el tipo de bien:", error);
      });
    window.location.reload();
  };

  const handleEditarTipoBien = (tipoBien) => {
    setTipoBienSeleccionado(tipoBien);
    setOpenModalEditar(true);
  };

  const handleActualizarTipoBien = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !tipoBienSeleccionado) return;

    const tipoBienParaEnviar = {
      nombreTipoBien: tipoBienSeleccionado.nombreTipoBien,
      status: tipoBienSeleccionado.status,
    };

    axios
      .put(`http://localhost:8080/api/tipo-bien/${tipoBienSeleccionado.tipoBienId}`, tipoBienParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTipoBienes(
          tipoBienes.map((tipo) => (tipo.tipoBienId === tipoBienSeleccionado.tipoBienId ? response.data : tipo))
        );
        setOpenModalEditar(false);
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el tipo de bien:", error);
      });
  };

  const handleEliminarTipoBien = (id) => {
    const tipoBien = tipoBienes.find((tipo) => tipo.tipoBienId === id);
    setTipoBienSeleccionado(tipoBien);
    setOpenModalEliminar(true);
  };

  const confirmarEliminarTipoBien = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !tipoBienSeleccionado) return;

    axios
      .delete(`http://localhost:8080/api/tipo-bien/${tipoBienSeleccionado.tipoBienId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setTipoBienes(tipoBienes.filter((tipo) => tipo.tipoBienId !== tipoBienSeleccionado.tipoBienId));
        setOpenModalEliminar(false);
      })
      .catch((error) => {
        console.error("Hubo un error al eliminar el tipo de bien:", error);
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
    { id: "tipoBienId", label: "ID", minWidth: 20 },
    { id: "nombreTipoBien", label: "Nombre", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 80 },
    { id: "crear", label: "Crear", minWidth: 50 },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear tipo de bien */}
      <Modal
        open={openModalCrear}
        onClose={() => setOpenModalCrear(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear Tipo de Bien
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCrearTipoBien();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Nombre del Tipo de Bien:</label>
                  <input
                    type="text"
                    value={nuevoTipoBien.nombreTipoBien}
                    onChange={(e) => setNuevoTipoBien({ ...nuevoTipoBien, nombreTipoBien: e.target.value })}
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
                    value={statusOptions.find((option) => option.value === nuevoTipoBien.status)}
                    onChange={(selected) => setNuevoTipoBien({ ...nuevoTipoBien, status: selected.value })}
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

      {/* Modal para editar tipo de bien */}
      <Modal
        open={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Editar Tipo de Bien
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleActualizarTipoBien();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Nombre del Tipo de Bien:</label>
                  <input
                    type="text"
                    value={tipoBienSeleccionado?.nombreTipoBien || ""}
                    onChange={(e) =>
                      setTipoBienSeleccionado({
                        ...tipoBienSeleccionado,
                        nombreTipoBien: e.target.value,
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
                    value={statusOptions.find((option) => option.value === tipoBienSeleccionado?.status)}
                    onChange={(selected) =>
                      setTipoBienSeleccionado({
                        ...tipoBienSeleccionado,
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

      {/* Modal para eliminar tipo de bien */}
      <Modal
        open={openModalEliminar}
        onClose={() => setOpenModalEliminar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminar Tipo de Bien
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar este tipo de bien?
            <br />
            <button onClick={confirmarEliminarTipoBien}>Confirmar</button>
            <button onClick={() => setOpenModalEliminar(false)}>Cancelar</button>
          </Typography>
        </Box>
      </Modal>

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper sx={{ overflow: "hidden" }} className="col-md-6 col-lg-6 col-xl-6" style={{ height: "fit-content" }}>
          {/* Título */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB" }}>
            <h3>Tipos de Bien Registrados</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Filtros */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                }}
                className="col-sm-12 col-md-12 col-lg-12 col-xl-12"
              >
                <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>

                <Select
                  placeholder="Estado"
                  value={filtroStatus}
                  onChange={setFiltroStatus}
                  options={statusOptions}
                  styles={customSelectStyles}
                />
                <button onClick={resetearFiltros} style={{ ...buttonStyle, backgroundColor: "#546EAB" }}>
                  Borrar
                </button>
              </div>
            </div>
          </Box>

          {/* Tabla */}
          <TableContainer sx={{ width: "100%", padding: "20px", paddingTop: "0px", paddingBottom: "0px" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        fontSize: "16px",
                        color: "#546EAB",
                      }}
                    >
                      {column.id === "crear" ? (
                        <button
                          onClick={() => setOpenModalCrear(true)}
                          style={{
                            backgroundColor: "#254B5E",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                            width: "100%",
                            padding: "4px",
                          }}
                        >
                          Crear
                        </button>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tipoBienes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tipo) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={tipo.tipoBienId}>
                      {columns.map((column) => {
                        if (column.id === "crear") {
                          return (
                            <TableCell key={column.id} align={column.align} style={{ textAlign: "center" }}>
                              <img
                                src={edit}
                                alt="Editar"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                                onClick={() => handleEditarTipoBien(tipo)}
                              />
                              <img
                                src={drop}
                                alt="Eliminar"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleEliminarTipoBien(tipo.tipoBienId)}
                              />
                            </TableCell>
                          );
                        } else {
                          const value = tipo[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ fontSize: "12px", textAlign: "start" }}
                            >
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
            count={tipoBienes.length}
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
    width: "150px",
    fontSize: "16px ",
    backgroundColor: "#A7D0D2",
    border: "none",
  }),
  option: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#000",
    textAlign: "start",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#000",
    textAlign: "center",
    backgroundColor: "#A7D0D2",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#000",
    textAlign: "center",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#000",
    textAlign: "center",
  }),
  menu: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#000",
    textAlign: "center",
    // backgroundColor: "red",
  }),
  menuList: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#000",
    textAlign: "center",
    // backgroundColor: "white",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#000",
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

export default Tipos;
