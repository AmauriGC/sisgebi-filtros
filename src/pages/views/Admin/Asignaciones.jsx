import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import edit from "../../../assets/img/pencil.svg";
import drop from "../../../assets/img/delete.svg";
import Sidebar from "../../../components/Sidebar";

const Asignaciones = () => {
  const [asignaciones, setAsignaciones] = React.useState([]);
  const [filtroStatus, setFiltroStatus] = React.useState(null);
  const [filtroUsuario, setFiltroUsuario] = React.useState(null);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = React.useState(null);

  const [usuarioOptions, setUsuarioOptions] = React.useState([]);
  const [bienOptions, setBienOptions] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const navigate = useNavigate();

  const [asignacionesSeleccionado, setAsignacionesSeleccionado] = React.useState(null);

  const [openModalActualizar, setOpenModalActualizar] = React.useState(false);
  const [openModalEliminar, setOpenModalEliminar] = React.useState(false);
  const [openModalCrear, setOpenModalCrear] = React.useState(false);

  const [nuevaAsignaciones, setNuevaAsignaciones] = React.useState({
    usuario: null,
    bien: null,
    status: "ACTIVO",
  });

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const disponibilidadOptions = [
    { value: "DISPONIBLE", label: "Disponible" },
    { value: "OCUPADO", label: "Ocupado" },
  ];

  const columns = [
    { id: "asignacionesId", label: "#", minWidth: 25 },
    { id: "usuario", label: "Usuario", minWidth: 80 },
    { id: "bien", label: "Bien", minWidth: 80 },
    { id: "status", label: "Estado", minWidth: 60 },
    { id: "disponibilidad", label: "Disponibilidad", minWidth: 80 },
    { id: "crear", label: "Crear", minWidth: 80 },
  ];

  React.useEffect(() => {
    obtenerAsignaciones();
    cargarOpcionesFiltros();
  }, []);

  React.useEffect(() => {
    aplicarFiltros();
  }, [filtroStatus, filtroDisponibilidad, filtroUsuario]);

  const obtenerAsignaciones = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8080/api/asignaciones", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAsignaciones(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las asignaciones:", error);
      });
  };

  const cargarOpcionesFiltros = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    // Obtener solo becarios
    axios
      .get("http://localhost:8080/api/usuarios/becarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarioOptions(
          response.data.map((usuario) => ({
            value: usuario.id,
            label: usuario.nombres,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar becarios:", error);
      });

    // Obtener bienes
    axios
      .get("http://localhost:8080/api/bienes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBienOptions(
          response.data.map((bien) => ({
            value: bien.idBien,
            label: bien.codigo,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar bienes:", error);
      });
  };

  const aplicarFiltros = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const paramsAsignaciones = {};
      if (filtroStatus) paramsAsignaciones.status = filtroStatus.value;
      if (filtroUsuario) paramsAsignaciones.id = filtroUsuario.value;

      // Obtener asignaciones filtradas por status y usuario
      const responseAsignaciones = await axios.get("http://localhost:8080/api/asignaciones/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params: paramsAsignaciones,
      });

      // Parámetros para filtrar bienes por disponibilidad
      const paramsBienes = {};
      if (filtroDisponibilidad) paramsBienes.disponibilidad = filtroDisponibilidad.value;

      // Obtener bienes filtrados por disponibilidad
      const responseBienes = await axios.get("http://localhost:8080/api/bienes/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params: paramsBienes,
      });

      // Filtrar asignaciones que coincidan con los bienes disponibles
      const asignacionesFiltradas = responseAsignaciones.data.filter((asignacion) =>
        responseBienes.data.some((bien) => bien.idBien === asignacion.bien.idBien)
      );

      // Actualizar el estado de las asignaciones
      setAsignaciones(asignacionesFiltradas);
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
    }
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
    setFiltroDisponibilidad(null);
    setFiltroUsuario(null);
    obtenerAsignaciones();
  };

  const handleCrear = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const asignacionesParaEnviar = {
      usuario: { id: nuevaAsignaciones.usuario.value },
      bien: { idBien: nuevaAsignaciones.bien.value },
      status: nuevaAsignaciones.status,
    };

    axios
      .post("http://localhost:8080/api/asignaciones", asignacionesParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAsignaciones([...asignaciones, response.data]);
        setOpenModalCrear(false);
        setNuevaAsignaciones({
          usuario: null,
          bien: null,
          status: "ACTIVO",
        });
        window.location.reload();
      })
      .catch((error) => {
        console.error("Hubo un error al crear la asignación:", error.response?.data || error.message);
      });
  };

  const handleEditarAsignaciones = (asignacion) => {
    setAsignacionesSeleccionado(asignacion);
    setOpenModalActualizar(true);
  };

  const handleActualizar = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !asignacionesSeleccionado) return;

    const asignacionParaEnviar = {
      usuario: { id: asignacionesSeleccionado.usuario.id },
      bien: { idBien: asignacionesSeleccionado.bien.idBien },
      status: asignacionesSeleccionado.status,
    };

    axios
      .put(`http://localhost:8080/api/asignaciones/${asignacionesSeleccionado.asignacionesId}`, asignacionParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAsignaciones(
          asignaciones.map((asignacion) =>
            asignacion.asignacionesId === asignacionesSeleccionado.asignacionesId ? response.data : asignacion
          )
        );
        setOpenModalActualizar(false);
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar la asignación:", error);
      });
  };

  const handleEliminarAsignaciones = (asignacionesId) => {
    const asignacion = asignaciones.find((asignacion) => asignacion.asignacionesId === asignacionesId);
    setAsignacionesSeleccionado(asignacion);
    setOpenModalEliminar(true);
  };

  const confirmarEliminar = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !asignacionesSeleccionado) return;

    axios
      .delete(`http://localhost:8080/api/asignaciones/${asignacionesSeleccionado.asignacionesId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAsignaciones(
          asignaciones.filter((asignacion) => asignacion.asignacionesId !== asignacionesSeleccionado.asignacionesId)
        );
        setOpenModalEliminar(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error al eliminar la asignación:", error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear */}
      <Modal
        open={openModalCrear}
        onClose={() => setOpenModalCrear(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear Asignación
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCrear();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Usuario:</label>
                  <Select
                    options={usuarioOptions}
                    value={nuevaAsignaciones.usuario}
                    onChange={(selected) => setNuevaAsignaciones({ ...nuevaAsignaciones, usuario: selected })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Bien:</label>
                  <Select
                    options={bienOptions}
                    value={nuevaAsignaciones.bien}
                    onChange={(selected) => setNuevaAsignaciones({ ...nuevaAsignaciones, bien: selected })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Estado:</label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === nuevaAsignaciones.status)}
                    onChange={(selected) => setNuevaAsignaciones({ ...nuevaAsignaciones, status: selected.value })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
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

      {/* Modal para editar */}
      <Modal
        open={openModalActualizar}
        onClose={() => setOpenModalActualizar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Editar Asignación
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleActualizar();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Usuario:</label>
                  <Select
                    options={usuarioOptions}
                    value={usuarioOptions.find((option) => option.value === asignacionesSeleccionado?.usuario?.id)}
                    onChange={(selected) =>
                      setAsignacionesSeleccionado({
                        ...asignacionesSeleccionado,
                        usuario: { id: selected.value },
                      })
                    }
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Estado:</label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === asignacionesSeleccionado?.status)}
                    onChange={(selected) =>
                      setAsignacionesSeleccionado({
                        ...asignacionesSeleccionado,
                        status: selected.value,
                      })
                    }
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
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

      {/* Modal para eliminar */}
      <Modal
        open={openModalEliminar}
        onClose={() => setOpenModalEliminar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminar Asignación
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar esta asignación?
            <br />
            <button onClick={confirmarEliminar}>Confirmar</button>
            <button onClick={() => setOpenModalEliminar(false)}>Cancelar</button>
          </Typography>
        </Box>
      </Modal>

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
        <Paper className="col-md-8 col-lg-8 col-xl-8" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB" }}>
            <h3>Asignaciones realizadas</h3>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>
              <button onClick={resetearFiltros} style={{ ...buttonStyle, backgroundColor: "#546EAB" }}>
                Borrar
              </button>
            </div>
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
                  marginBottom: "10px",
                }}
                className="col-sm-12 col-md-12 col-lg-12 col-xl-12"
              >
                <Select
                  placeholder="Usuario"
                  value={filtroUsuario}
                  onChange={setFiltroUsuario}
                  options={usuarioOptions}
                  styles={customSelectStyles}
                />
                <Select
                  placeholder="Estado"
                  value={filtroStatus}
                  onChange={setFiltroStatus}
                  options={statusOptions}
                  styles={customSelectStyles}
                />
                <Select
                  placeholder="Disponibilidad"
                  value={filtroDisponibilidad}
                  onChange={setFiltroDisponibilidad}
                  options={disponibilidadOptions}
                  styles={customSelectStyles}
                />
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
                        fontSize: "12px",
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
                            fontSize: "13px",
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
                {asignaciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asignacion) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={asignacion.asignacionesId}>
                      {columns.map((column) => {
                        if (column.id === "crear") {
                          return (
                            <TableCell key={column.id} align={column.align}>
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
                                  onClick={() => handleEditarAsignaciones(asignacion)}
                                />
                                <img
                                  src={drop}
                                  alt="Eliminar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEliminarAsignaciones(asignacion.asignacionesId)}
                                />
                              </div>
                            </TableCell>
                          );
                        } else {
                          const value =
                            column.id === "usuario"
                              ? asignacion.becario?.nombres
                              : column.id === "bien"
                              ? asignacion.bien?.codigo
                              : column.id === "status"
                              ? asignacion.status
                              : column.id === "disponibilidad"
                              ? asignacion.bien?.disponibilidad
                              : asignacion[column.id];
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
            count={asignaciones.length}
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
  padding: "5px",
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
export default Asignaciones;
