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
import SidebarBecario from "../../../../components/SidebarBecario";
import eye from "../../../../assets/img/eye-outline.svg";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const MisAsignaciones = () => {
  const [asignaciones, setAsignaciones] = React.useState([]);
  const [filtroStatus, setFiltroStatus] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [openModalBien, setOpenModalBien] = React.useState(false);
  const [bienSeleccionado, setBienSeleccionado] = React.useState(null);
  const [id, setUserId] = React.useState(null);
  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const columns = [
    { id: "numero", label: "#", minWidth: 25 },
    { id: "bien", label: "Bien", minWidth: 80 },
    { id: "status", label: "Estado de la asignación", minWidth: 60 },
    { id: "acciones", label: "Acciones", minWidth: 80 },
  ];

  // Verificar token y rol al montar el componente
  React.useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "Debes iniciar sesión para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (role !== "BECARIO") {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "No tienes permiso para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    setUserId(decodedToken.id);
    obtenerAsignaciones();
  }, [navigate]);

  const obtenerAsignaciones = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "Debes iniciar sesión para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (role !== "BECARIO") {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "No tienes permiso para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    axios
      .get("http://localhost:8080/api/asignaciones", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAsignaciones(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las asignaciones:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las asignaciones. Inténtalo de nuevo más tarde.",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
    obtenerAsignaciones();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleVerBien = (bien) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "Debes iniciar sesión para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (role !== "BECARIO") {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "No tienes permiso para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    axios
      .get(`http://localhost:8080/api/bienes/${bien.bienId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBienSeleccionado(response.data);
        setOpenModalBien(true);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del bien:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los detalles del bien. Inténtalo de nuevo más tarde.",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  const handleEliminarAsignacion = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "Debes iniciar sesión para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (role !== "BECARIO") {
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "No tienes permiso para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/");
      });
      return;
    }

    if (!bienSeleccionado) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se ha seleccionado ningún bien para eliminar la asignación.",
        showConfirmButton: true,
      });
      return;
    }

    // Primero necesitamos encontrar la asignación correspondiente al bien seleccionado
    const asignacionAEliminar = asignaciones.find((asignacion) => asignacion.bien.bienId === bienSeleccionado.bienId);

    if (!asignacionAEliminar) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró la asignación para este bien.",
        showConfirmButton: true,
      });
      return;
    }
    setOpenModalBien(false);
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la asignación del bien seleccionado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#254B5E",
      cancelButtonColor: "#c2c2c2",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/api/asignaciones/${asignacionAEliminar.asignacionesId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setOpenModalBien(false);
            Swal.fire({
              icon: "success",
              title: "¡Éxito!",
              text: "Asignación eliminada correctamente",
              showConfirmButton: false,
              timer: 3000,
            }).then(() => {
              obtenerAsignaciones(); // Actualizar la lista
            });
          })
          .catch((error) => {
            console.error("Error al eliminar la asignación:", error);
            setOpenModalBien(false);

            let errorMessage = "No se pudo eliminar la asignación. ";

            Swal.fire({
              icon: "error",
              title: "Error",
              text: errorMessage,
              showConfirmButton: true,
            });
          });
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        backgroundColor: "#F0F0F0",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {" "}
      {/* Modal para mostrar los detalles del bien */}
      <Modal
        open={openModalBien}
        onClose={() => setOpenModalBien(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ fontWeight: "bold", color: "#254B5E" }}>
            Detalles del Bien
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                backgroundColor: "#f9f9f9",
                p: 3,
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Código:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.codigo}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Número de Serie:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.numeroSerie}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Responsable:
                </Typography>
                <Typography variant="body1">{`${bienSeleccionado?.usuario.nombres} ${bienSeleccionado?.usuario.apellidos}`}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Marca:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.marca?.nombreMarca}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Modelo:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.modelo?.nombreModelo}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Tipo de Bien:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.tipoBien?.nombreTipoBien}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Área Común:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.areaComun?.nombreArea}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Estado:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.status}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Disponibilidad:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.disponibilidad}</Typography>
              </Box>
            </Box>
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: "10px" }}>
            <button
              onClick={() => setOpenModalBien(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#c2c2c2",
                color: "#ffffff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
            <button
              onClick={handleEliminarAsignacion}
              style={{
                padding: "10px 20px",
                backgroundColor: "#254B5E",
                color: "#ffffff",
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
      <SidebarBecario />
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
        <Paper className="col-md-5 col-lg-5 col-xl-5" style={{ height: "fit-content" }}>
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Mis asignaciones</h3>
          </Box>

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
                {asignaciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((asignacion, index) => {
                  const numeroFila = page * rowsPerPage + index + 1; // Calculamos el número de fila

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
                                  onClick={() => handleVerBien(asignacion.bien)}
                                />
                              </div>
                            </TableCell>
                          );
                        } else if (column.id === "numero") {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ fontSize: "12px", textAlign: "start" }}
                            >
                              {numeroFila}
                            </TableCell>
                          );
                        } else {
                          const value =
                            column.id === "bien"
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

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={asignaciones.length}
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
  width: "100px",
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

export default MisAsignaciones;
