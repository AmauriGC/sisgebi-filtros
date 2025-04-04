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
import Sidebar from "../../../../components/Sidebar";
import eye from "../../../../assets/img/eye-outline.svg";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import AsignacionModalVer from "./Components/AsignacionModalVer";
import { jwtDecode } from "jwt-decode";

const Asignaciones = () => {
  const [asignaciones, setAsignaciones] = React.useState([]);
  const [filtroStatus, setFiltroStatus] = React.useState(null);
  const [filtroUsuario, setFiltroUsuario] = React.useState(null);
  const [usuarioOptions, setUsuarioOptions] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const [openModalBien, setOpenModalBien] = React.useState(false);
  const [bienSeleccionado, setBienSeleccionado] = React.useState(null);

  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const columns = [
    { id: "asignacionesId", label: "#", minWidth: 25 },
    { id: "usuario", label: "Usuario", minWidth: 80 },
    { id: "bien", label: "Bien", minWidth: 80 },
    { id: "status", label: "Estado de la asignación", minWidth: 60 },
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

    if (role !== "ADMINISTRADOR") {
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
      });
  };

  const cargarOpcionesFiltros = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      // Si no hay token, redirige al usuario a la página de inicio de sesión
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "Debes iniciar sesión para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/"); // Redirige sin recargar la página
      });
      return; // Detiene la ejecución del efecto
    }

    // Si hay token, decodifícalo y obtén los datos del usuario
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (role !== "ADMINISTRADOR") {
      // Si el rol no es "admin", redirige al usuario a la página de inicio de sesión
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "No tienes permiso para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/"); // Redirige sin recargar la página
      });
      return; // Detiene la ejecución del efecto
    }

    axios
      .get("http://localhost:8080/api/asignaciones", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const usuariosConAsignaciones = response.data.map((asignacion) => asignacion.usuario.id);

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
            Swal.fire({
              icon: "error",
              title: "Error al cargar los becarios",
              text: "Hubo un problema al intentar cargar la lista de becarios. Por favor, inténtalo de nuevo más tarde.",
              showConfirmButton: true,
            });
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar las asignaciones",
          text: "Hubo un problema al intentar obtener las asignaciones. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const aplicarFiltros = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      // Si no hay token, redirige al usuario a la página de inicio de sesión
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "Debes iniciar sesión para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/"); // Redirige sin recargar la página
      });
      return; // Detiene la ejecución del efecto
    }

    // Si hay token, decodifícalo y obtén los datos del usuario
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (role !== "ADMINISTRADOR") {
      // Si el rol no es "admin", redirige al usuario a la página de inicio de sesión
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "No tienes permiso para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/"); // Redirige sin recargar la página
      });
      return; // Detiene la ejecución del efecto
    }

    try {
      const paramsAsignaciones = {};
      if (filtroStatus) paramsAsignaciones.status = filtroStatus.value;
      if (filtroUsuario) paramsAsignaciones.id = filtroUsuario.value;

      const responseAsignaciones = await axios.get("http://localhost:8080/api/asignaciones/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params: paramsAsignaciones,
      });

      const responseBienes = await axios.get("http://localhost:8080/api/bienes/filter", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const asignacionesFiltradas = responseAsignaciones.data.filter((asignacion) =>
        responseBienes.data.some((bien) => bien.bienId === asignacion.bien.bienId)
      );

      setAsignaciones(asignacionesFiltradas);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al aplicar filtros",
        text: "Hubo un problema al intentar aplicar los filtros. Por favor, verifica los datos e inténtalo de nuevo.",
        showConfirmButton: true,
      });
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

  const handleVerBien = (bien) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      // Si no hay token, redirige al usuario a la página de inicio de sesión
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "Debes iniciar sesión para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/"); // Redirige sin recargar la página
      });
      return; // Detiene la ejecución del efecto
    }

    // Si hay token, decodifícalo y obtén los datos del usuario
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;

    if (role !== "ADMINISTRADOR") {
      // Si el rol no es "admin", redirige al usuario a la página de inicio de sesión
      Swal.fire({
        icon: "warning",
        title: "Acceso no autorizado",
        text: "No tienes permiso para acceder a esta página.",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate("/"); // Redirige sin recargar la página
      });
      return; // Detiene la ejecución del efecto
    }

    axios.get(`http://localhost:8080/api/bienes/${bien.bienId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire({
      icon: "info",
      title: "Detalles del Bien",
      text: `Mostrando detalles del bien: ${bien.codigo}`,
      showConfirmButton: false,
      timer: 1500,
    })
      .then(() => {
        setBienSeleccionado(bien);
        setOpenModalBien(true);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar los detalles",
          text: "No se pudieron cargar los detalles del bien. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para mostrar los detalles del bien */}
      <AsignacionModalVer
        openModalBien={openModalBien}
        setOpenModalBien={setOpenModalBien}
        bienSeleccionado={bienSeleccionado}
      />

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
        <Paper className="col-md-8 col-lg-8 col-xl-7" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Asignaciones realizadas</h3>

            {/* Contenedor principal con distribución adecuada */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/* Filtros alineados a la izquierda */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>
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

              {/* Botones alineados a la derecha en columna */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginLeft: "auto" }}>
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

export default Asignaciones;
