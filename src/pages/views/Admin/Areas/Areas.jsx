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
import Box from "@mui/material/Box";
import edit from "../../../../assets/img/pencil.svg";
import drop from "../../../../assets/img/delete.svg";
import Sidebar from "../../../../components/Sidebar";
import AreaModalCrear from "./Components/AreaModalCrear";
import AreaModalEditar from "./Components/AreaModalEditar";
import AreaModalEliminar from "./Components/AreaModalEliimnar";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

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

    const areaParaEnviar = {
      nombreArea: nuevaArea.nombreArea,
      status: nuevaArea.status,
    };

    axios
      .post("http://localhost:8080/api/areas", areaParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Agregar la nueva área al estado
        setAreas([...areas, response.data]);

        // Cerrar el modal y resetear el formulario
        setOpenModalCrear(false);
        setNuevaArea({
          nombreArea: "",
          status: "ACTIVO",
        });

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Área creada correctamente",
          showConfirmButton: false,
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error("Hubo un error al crear el área:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo crear la area",
        });
      });
  };

  const handleEditarArea = (area) => {
    setAreaSeleccionada(area);
    setOpenModalEditar(true);
  };

  const handleActualizarArea = () => {
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

    if (!areaSeleccionada) return;

    const areaParaEnviar = {
      nombreArea: areaSeleccionada.nombreArea,
      status: areaSeleccionada.status,
    };

    axios
      .put(`http://localhost:8080/api/areas/${areaSeleccionada.areaId}`, areaParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Actualizar el área en el estado
        setAreas(areas.map((area) => (area.areaId === areaSeleccionada.areaId ? response.data : area)));

        // Cerrar el modal de edición
        setOpenModalEditar(false);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Área actualizada correctamente",
          showConfirmButton: false,
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el área:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo actualizar el área",
        });
      });
  };

  const handleEliminarArea = (id) => {
    const area = areas.find((area) => area.areaId === id);
    setAreaSeleccionada(area);
    setOpenModalEliminar(true);
  };

  const confirmarEliminarArea = () => {
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

    if (!areaSeleccionada) return;

    axios
      .delete(`http://localhost:8080/api/areas/${areaSeleccionada.areaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Eliminar el área del estado
        setAreas(areas.map((a) => (a.areaId === areaSeleccionada.areaId ? { ...a, status: "INACTIVO" } : a)));

        // Cerrar el modal de eliminación
        setOpenModalEliminar(false);
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El área ha sido eliminada",
          showConfirmButton: false,
          timer: 3000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se ha podido eliminar el área",
        });
      });
  };

  const columns = [
    { id: "areaId", label: "#", minWidth: 50 },
    { id: "nombreArea", label: "Nombre", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 100 },
    { id: "acciones", label: "Acciones", minWidth: 50 },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear área */}
      <AreaModalCrear
        openModalCrear={openModalCrear}
        setOpenModalCrear={setOpenModalCrear}
        nuevaArea={nuevaArea}
        setNuevaArea={setNuevaArea}
        handleCrearArea={handleCrearArea}
      />

      {/* Modal para editar área */}
      <AreaModalEditar
        openModalEditar={openModalEditar}
        setOpenModalEditar={setOpenModalEditar}
        areaSeleccionada={areaSeleccionada}
        setAreaSeleccionada={setAreaSeleccionada}
        statusOptions={statusOptions}
        handleActualizarArea={handleActualizarArea}
      />

      {/* Modal para eliminar área */}

      <AreaModalEliminar
        openModalEliminar={openModalEliminar}
        setOpenModalEliminar={setOpenModalEliminar}
        confirmarEliminarArea={confirmarEliminarArea}
      />

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper className="col-md-8 col-lg-6 col-xl-6" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Áreas Comunes</h3>

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
                {areas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((area) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={area.areaId}>
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

export default Areas;
