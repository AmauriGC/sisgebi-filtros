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
import Box from "@mui/material/Box";
import Sidebar from "../../../components/Sidebar";
import eye from "../../../assets/img/eye-outline.svg";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const Asignaciones = () => {
  const [asignaciones, setAsignaciones] = React.useState([]);
  const [filtroStatus, setFiltroStatus] = React.useState(null);
  const [filtroUsuario, setFiltroUsuario] = React.useState(null);

  const [usuarioOptions, setUsuarioOptions] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const navigate = useNavigate();

  // Estado para controlar el modal y los detalles del bien
  const [openModalBien, setOpenModalBien] = React.useState(false);
  const [bienSeleccionado, setBienSeleccionado] = React.useState(null);

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const columns = [
    { id: "asignacionesId", label: "#", minWidth: 25 },
    { id: "usuario", label: "Usuario", minWidth: 80 },
    { id: "bien", label: "Bien", minWidth: 80 },
    { id: "status", label: "Estado de la asignacion", minWidth: 60 },
    { id: "acciones", label: "Acciones", minWidth: 80 },
  ];

  React.useEffect(() => {
    obtenerAsignaciones();
    cargarOpcionesFiltros();
  }, []);

  React.useEffect(() => {
    aplicarFiltros();
  }, [filtroStatus, filtroUsuario]);

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

    // Obtener las asignaciones para extraer los IDs de los usuarios con asignaciones
    axios
      .get("http://localhost:8080/api/asignaciones", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const usuariosConAsignaciones = response.data.map((asignacion) => asignacion.usuario.id);

        // Obtener solo los becarios que tienen asignaciones
        axios
          .get("http://localhost:8080/api/usuarios/becarios", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const becariosConAsignaciones = response.data.filter((usuario) =>
              usuariosConAsignaciones.includes(usuario.id)
            );

            setUsuarioOptions(
              becariosConAsignaciones.map((usuario) => ({
                value: usuario.id,
                label: usuario.nombres,
              }))
            );
          })
          .catch((error) => {
            console.error("Error al cargar becarios:", error);
          });
      })
      .catch((error) => {
        console.error("Error al obtener las asignaciones:", error);
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

      // Obtener bienes filtrados por disponibilidad
      const responseBienes = await axios.get("http://localhost:8080/api/bienes/filter", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filtrar asignaciones que coincidan con los bienes disponibles
      const asignacionesFiltradas = responseAsignaciones.data.filter((asignacion) =>
        responseBienes.data.some((bien) => bien.bienId === asignacion.bien.bienId)
      );

      // Actualizar el estado de las asignaciones
      setAsignaciones(asignacionesFiltradas);
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
    }
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
    setFiltroUsuario(null);
    obtenerAsignaciones();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Función para abrir el modal y obtener los detalles del bien
  const handleVerBien = (bien) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    axios
      .get(`http://localhost:8080/api/bienes/${bien.bienId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBienSeleccionado(response.data); // Guardar los detalles del bien
        setOpenModalBien(true); // Abrir el modal
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del bien:", error);
      });
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
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
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {asignaciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asignacion) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={asignacion.asignacionesId}>
                      {columns.map((column) => {
                        if (column.id === "acciones") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <div style={{ display: "flex" }}>
                                <img
                                  src={eye}
                                  alt="Ver"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                    marginRight: "8px",
                                  }}
                                  onClick={() => handleVerBien(asignacion.bien)} // Pasar el bien seleccionado
                                />
                              </div>
                            </TableCell>
                          );
                        } else {
                          const value =
                            column.id === "usuario"
                              ? asignacion.usuario?.nombres
                              : column.id === "bien"
                              ? asignacion.bien?.codigo
                              : column.id === "status"
                              ? asignacion.status
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

      {/* Modal para mostrar los detalles del bien */}
      <Modal
        open={openModalBien}
        onClose={() => setOpenModalBien(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Detalles del Bien
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {bienSeleccionado && (
              <div>
                <p>
                  <strong>Código:</strong> {bienSeleccionado.codigo}
                </p>
                <p>
                  <strong>Número de Serie:</strong> {bienSeleccionado.numeroSerie}
                </p>
                <p>
                  <strong>Tipo de Bien:</strong> {bienSeleccionado.tipoBien?.nombreTipoBien}
                </p>
                <p>
                  <strong>Marca:</strong> {bienSeleccionado.marca?.nombreMarca}
                </p>
                <p>
                  <strong>Modelo:</strong> {bienSeleccionado.modelo?.nombreModelo}
                </p>
                <p>
                  <strong>Área Común:</strong> {bienSeleccionado.areaComun?.nombreArea || "N/A"}
                </p>
                <p>
                  <strong>Estado del bien:</strong> {bienSeleccionado.status}
                </p>
                <p>
                  <strong>Disponibilidad:</strong> {bienSeleccionado.disponibilidad}
                </p>
              </div>
            )}
          </Typography>
        </Box>
      </Modal>
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
