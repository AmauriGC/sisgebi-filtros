import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import edit from "../../../assets/img/pencil.svg";
import drop from "../../../assets/img/delete.svg";
import Sidebar from "../../../components/Sidebar";

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModalCrear, setOpenModalCrear] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);

  const [nuevaArea, setNuevaArea] = useState({
    nombreArea: "",
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
      window.location.href = "/";
      return;
    }

    // Obtener todas las áreas comunes
    axios
      .get("http://localhost:8080/api/areas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las áreas comunes:", error);
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
      console.error("No se encontró un token válido.");
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/areas/filter", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error al filtrar las áreas comunes:", error);
        if (error.response && error.response.status === 403) {
          console.error("Token no válido, redirigiendo al login.");
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
      .get("http://localhost:8080/api/areas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las áreas comunes:", error);
        window.location.href = "/";
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCrearArea = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const areaParaEnviar = {
      nombreArea: nuevaArea.nombreArea,
      status: nuevaArea.status,
    };

    axios
      .post("http://localhost:8080/api/areas", areaParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAreas([...areas, response.data]);
        setOpenModalCrear(false);
        setNuevaArea({
          nombreArea: "",
          status: "ACTIVO",
        });
        window.location.reload();
      })
      .catch((error) => {
        console.error("Hubo un error al crear el área:", error);
      });
  };

  const handleEditarArea = (area) => {
    setAreaSeleccionada({
      ...area,
      areaId: area.areaId,
    });
    setOpenModalEditar(true);
  };

  const handleActualizarArea = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !areaSeleccionada) return;

    const areaParaEnviar = {
      nombreArea: areaSeleccionada.nombreArea,
      status: areaSeleccionada.status,
    };

    axios
      .put(`http://localhost:8080/api/areas/${areaSeleccionada.areaId}`, areaParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAreas(areas.map((area) => (area.areaId === areaSeleccionada.areaId ? response.data : area)));
        setOpenModalEditar(false);
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el área:", error);
      });
  };

  const handleEliminarArea = (id) => {
    const area = areas.find((area) => area.areaId === id);
    setAreaSeleccionada(area);
    setOpenModalEliminar(true);
  };

  const confirmarEliminarArea = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !areaSeleccionada) return;

    axios
      .delete(`http://localhost:8080/api/areas/${areaSeleccionada.areaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAreas(areas.filter((area) => area.areaId !== areaSeleccionada.areaId));
        setOpenModalEliminar(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Hubo un error al eliminar el área:", error);
      });
  };

  const columns = [
    { id: "areaId", label: "ID", minWidth: 50 },
    { id: "nombreArea", label: "Nombre", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 100 },
    { id: "crear", label: "Crear", minWidth: 50 },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear área */}
      <Modal
        open={openModalCrear}
        onClose={() => setOpenModalCrear(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear Área
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCrearArea();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Nombre del Área:</label>
                  <input
                    type="text"
                    value={nuevaArea.nombreArea}
                    onChange={(e) => setNuevaArea({ ...nuevaArea, nombreArea: e.target.value })}
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
                    value={statusOptions.find((option) => option.value === nuevaArea.status)}
                    onChange={(selected) => setNuevaArea({ ...nuevaArea, status: selected.value })}
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

      {/* Modal para editar área */}
      <Modal
        open={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Editar Área
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleActualizarArea();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Nombre del Área:</label>
                  <input
                    type="text"
                    value={areaSeleccionada?.nombreArea || ""}
                    onChange={(e) =>
                      setAreaSeleccionada({
                        ...areaSeleccionada,
                        nombreArea: e.target.value,
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
                    value={statusOptions.find((option) => option.value === areaSeleccionada?.status)}
                    onChange={(selected) =>
                      setAreaSeleccionada({
                        ...areaSeleccionada,
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

      {/* Modal para eliminar área */}
      <Modal
        open={openModalEliminar}
        onClose={() => setOpenModalEliminar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminar Área
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar esta área?
            <br />
            <button onClick={confirmarEliminarArea}>Confirmar</button>
            <button onClick={() => setOpenModalEliminar(false)}>Cancelar</button>
          </Typography>
        </Box>
      </Modal>

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper className="col-md-9 col-lg-9 col-xl-9" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB" }}>
            <h3>Áreas Comunes</h3>
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
                <button onClick={resetFilters} style={{ ...buttonStyle, backgroundColor: "#546EAB" }}>
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
                {areas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((area) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={area.areaId}>
                      {columns.map((column) => {
                        if (column.id === "crear") {
                          return (
                            <TableCell key={column.id} align={column.align} style={{ textAlign: "center" }}>
                              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img
                                  src={edit}
                                  alt="Editar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                    marginRight: "8px",
                                  }}
                                  onClick={() => handleEditarArea(area)}
                                />
                                <img
                                  src={drop}
                                  alt="Eliminar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEliminarArea(area.areaId)}
                                />
                              </div>
                            </TableCell>
                          );
                        } else {
                          const value = column.id === "area" ? area.area.nombreArea : area[column.id];
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
            count={areas.length}
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
    width: "200px",
    backgroundColor: "#A7D0D2",
    border: "none",
  }),
  option: (base) => ({
    ...base,
    fontSize: "12px",
    color: "#000",
    textAlign: "start",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "14px",
    color: "#000",
    textAlign: "center",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "12px",
    color: "#000",
    textAlign: "center",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    fontSize: "12px",
    color: "#000",
    textAlign: "center",
  }),
  menu: (base) => ({
    ...base,
    fontSize: "12px",
    color: "#000",
    textAlign: "center",
  }),
  menuList: (base) => ({
    ...base,
    fontSize: "12px",
    color: "#000",
    textAlign: "center",
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

export default Areas;
