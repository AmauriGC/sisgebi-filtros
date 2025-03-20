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
import edit from "../../../assets/img/pencil.svg";
import drop from "../../../assets/img/delete.svg";
import Sidebar from "../../../components/Sidebar";

const Modelos = () => {
  const [modelos, setModelos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [openModalCrear, setOpenModalCrear] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [colorAlerta, setColorAlerta] = useState("");

  const [nuevoModelo, setNuevoModelo] = useState({
    nombreModelo: "",
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCrearModelo = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const modeloParaEnviar = {
      nombreModelo: nuevoModelo.nombreModelo,
      status: nuevoModelo.status,
    };

    axios
      .post("http://localhost:8080/api/modelo", modeloParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Agregar el nuevo modelo al estado
        setModelos([...modelos, response.data]);

        // Cerrar el modal y resetear el formulario
        setOpenModalCrear(false);
        setNuevoModelo({
          nombreModelo: "",
          status: "ACTIVO",
        });

        // Mostrar mensaje de éxito
        setMensajeAlerta("Modelo creado correctamente");
        setColorAlerta("#64C267"); // Color verde para éxito

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Hubo un error al crear el modelo:", error);

        // Mostrar mensaje de error
        setMensajeAlerta("No se pudo crear el modelo");
        setColorAlerta("#C26464"); // Color rojo para error

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      });
  };

  const handleEditarModelo = (modelo) => {
    setModeloSeleccionado(modelo);
    setOpenModalEditar(true);
  };

  const handleActualizarModelo = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !modeloSeleccionado) return;

    const modeloParaEnviar = {
      nombreModelo: modeloSeleccionado.nombreModelo,
      status: modeloSeleccionado.status,
    };

    axios
      .put(`http://localhost:8080/api/modelo/${modeloSeleccionado.modeloId}`, modeloParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Actualizar el modelo en el estado
        setModelos(modelos.map((modelo) => (modelo.modeloId === modeloSeleccionado.modeloId ? response.data : modelo)));

        // Cerrar el modal de edición
        setOpenModalEditar(false);

        // Mostrar mensaje de éxito
        setMensajeAlerta("Modelo actualizado correctamente");
        setColorAlerta("#64C267");

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el modelo:", error);

        // Mostrar mensaje de error
        setMensajeAlerta("No se pudo actualizar el modelo");
        setColorAlerta("#C26464");

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
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
        // Actualizar el estado del modelo a INACTIVO
        setModelos(
          modelos.map((modelo) =>
            modelo.modeloId === modeloSeleccionado.modeloId ? { ...modelo, status: "INACTIVO" } : modelo
          )
        );

        // Cerrar el modal de eliminación
        setOpenModalEliminar(false);

        // Mostrar mensaje de éxito
        setMensajeAlerta("El modelo se ha eliminado correctamente");
        setColorAlerta("#64C267");

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Hubo un error al eliminar el modelo:", error);

        // Mostrar mensaje de error
        setMensajeAlerta("No se ha podido eliminar el modelo");
        setColorAlerta("#C26464");

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      });
  };

  const columns = [
    { id: "modeloId", label: "#", minWidth: 50 },
    { id: "nombreModelo", label: "Nombre", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 100 },
    { id: "acciones", label: "Acciones", minWidth: 50 },
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
          <Typography id="modal-modal-title" variant="h4" component="h2">
            <strong>Registrar Modelo</strong>
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
                  <label>
                    <strong>Nombre del Modelo:</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del modelo"
                    value={nuevoModelo.nombreModelo}
                    onChange={(e) => setNuevoModelo({ ...nuevoModelo, nombreModelo: e.target.value })}
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                <button
                  onClick={() => setOpenModalCrear(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#b7b7b7",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#254B5E",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Registrar
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
          <Typography id="modal-modal-title" variant="h4" component="h2">
            <strong>Editar Modelo</strong>
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
                  <label>
                    <strong>Nombre del Modelo:</strong>
                  </label>
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
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Estado:</strong>
                  </label>
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
                    styles={SelectOptionsStyles}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                <button
                  onClick={() => setOpenModalEditar(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#b7b7b7",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#254B5E",
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 480,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminar Modelo
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar este modelo?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
            <button
              onClick={() => setOpenModalEliminar(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#b7b7b7",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmarEliminarModelo}
              style={{
                padding: "10px 20px",
                backgroundColor: "#254B5E",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Eliminar
            </button>
          </Box>
        </Box>
      </Modal>

      {/* Modal de alerta */}
      <Modal open={!!mensajeAlerta} onClose={() => setMensajeAlerta("")} aria-labelledby="alerta-modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: "10px",
            textAlign: "center",
            border: `3px solid ${colorAlerta}`,
          }}
        >
          <Typography id="alerta-modal-title" sx={{ color: colorAlerta, fontWeight: "bold" }}>
            {mensajeAlerta}
          </Typography>
        </Box>
      </Modal>

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper sx={{ overflow: "hidden" }} className="col-md-8 col-lg-6 col-xl-6" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Modelos Registrados</h3>

            {/* Contenedor principal con distribución adecuada */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/* Filtros alineados a la izquierda */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>
                <Select
                  placeholder="Estado"
                  value={filtroStatus}
                  onChange={setFiltroStatus}
                  options={statusOptions}
                  styles={customSelectStyles}
                />
              </div>

              {/* Botones alineados a la derecha en columna */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginLeft: "auto" }}>
                <button onClick={resetFilters} style={{ ...buttonStyle, backgroundColor: "#546EAB" }}>
                  Borrar
                </button>
                <button
                  onClick={() => setOpenModalCrear(true)}
                  style={{
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    backgroundColor: "#254B5E",
                    padding: "8px",
                  }}
                >
                  Crear
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
                        if (column.id === "acciones") {
                          return (
                            <TableCell key={column.id} align={column.align} style={{ textAlign: "center" }}>
                              <div style={{ display: "flex" }}>
                                <img
                                  src={edit}
                                  alt="Editar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                    marginRight: "8px",
                                  }}
                                  onClick={() => handleEditarModelo(modelo)}
                                />
                                <img
                                  src={drop}
                                  alt="Eliminar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEliminarModelo(modelo.modeloId)}
                                />
                              </div>
                            </TableCell>
                          );
                        } else {
                          const value = modelo[column.id];
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
            count={modelos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            SelectProps={{
              native: true,
            }}
            sx={{
              "& .MuiTablePagination-selectLabel": {
                fontSize: "14px",
                color: "#546EAB",
              },
              "& .MuiTablePagination-displayedRows": {
                fontSize: "14px",
                color: "#546EAB",
              },
              "& .MuiTablePagination-select": {
                fontSize: "14px",
                color: "#546EAB",
                textAlign: "center",
              },
            }}
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
  width: "150px",
};

const customSelectStyles = {
  control: (base) => ({
    ...base,
    width: "150px",
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

const SelectOptionsStyles = {
  control: (base) => ({
    ...base,
    width: "100%",
    height: "40px",
    border: "solid 1px #c2c2c2",
  }),
  option: (base) => ({
    ...base,
    color: "#000",
    textAlign: "start",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#000",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#757575",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#000",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#c2c2c2",
  }),
};

export default Modelos;
