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
import edit from "../../../../assets/img/pencil.svg";
import drop from "../../../../assets/img/delete.svg";
import Sidebar from "../../../../components/Sidebar";
import MarcaModalCrear from "./Components/MarcaModalCrear";
import MarcaModalEditar from "./Components/MarcaModalEditar";
import MarcaModalEliimnar from "./Components/MarcaModalEliminar";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCrearMarca = () => {
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

    const marcaParaEnviar = {
      nombreMarca: nuevaMarca.nombreMarca,
      status: nuevaMarca.status,
    };

    axios
      .post("http://localhost:8080/api/marca", marcaParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Agregar la nueva marca al estado
        setMarcas([...marcas, response.data]);

        // Cerrar el modal y resetear el formulario
        setOpenModalCrear(false);
        setNuevaMarca({
          nombreMarca: "",
          status: "ACTIVO",
        });

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Marca creada correctamente",
          showConfirmButton: false,
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error("Hubo un error al crear la marca:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo crear la area",
        });
      });
  };

  const handleEditarMarca = (marca) => {
    setMarcaSeleccionada(marca);
    setOpenModalEditar(true);
  };

  const handleActualizarMarca = () => {
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

    if (!marcaSeleccionada) return;

    const marcaParaEnviar = {
      nombreMarca: marcaSeleccionada.nombreMarca,
      status: marcaSeleccionada.status,
    };

    axios
      .put(`http://localhost:8080/api/marca/${marcaSeleccionada.marcaId}`, marcaParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Actualizar la marca en el estado
        setMarcas(marcas.map((marca) => (marca.marcaId === marcaSeleccionada.marcaId ? response.data : marca)));

        // Cerrar el modal de edición
        setOpenModalEditar(false);

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Marca actualizada correctamente",
          showConfirmButton: false,
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar la marca:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo actualizar la marca",
        });
      });
  };

  const handleEliminarMarca = (id) => {
    const marca = marcas.find((marca) => marca.marcaId === id);
    setMarcaSeleccionada(marca);
    setOpenModalEliminar(true);
  };

  const confirmarEliminarMarca = () => {
    const token = sessionStorage.getItem("token");
    if (!marcaSeleccionada) return;

    axios
      .delete(`http://localhost:8080/api/marca/${marcaSeleccionada.marcaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Actualizar el estado de la marca a INACTIVO
        setMarcas(
          marcas.map((marca) =>
            marca.marcaId === marcaSeleccionada.marcaId ? { ...marca, status: "INACTIVO" } : marca
          )
        );

        // Cerrar el modal de eliminación
        setOpenModalEliminar(false);
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "Marca eliminada correctamente",
          showConfirmButton: false,
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error("Hubo un error al eliminar la marca:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo eliminar la marca",
        });
      });
  };

  const columns = [
    { id: "marcaId", label: "#", minWidth: 50 },
    { id: "nombreMarca", label: "Nombre", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 100 },
    { id: "acciones", label: "Acciones", minWidth: 50 },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear marca */}
      <MarcaModalCrear
        openModalCrear={openModalCrear}
        setOpenModalCrear={setOpenModalCrear}
        nuevaMarca={nuevaMarca}
        setNuevaMarca={setNuevaMarca}
        handleCrearMarca={handleCrearMarca}
      />

      {/* Modal para editar marca */}
      <MarcaModalEditar
        openModalEditar={openModalEditar}
        setOpenModalEditar={setOpenModalEditar}
        marcaSeleccionada={marcaSeleccionada}
        setMarcaSeleccionada={setMarcaSeleccionada}
        statusOptions={statusOptions}
        handleActualizarMarca={handleActualizarMarca}
      />

      {/* Modal para eliminar marca */}
      <MarcaModalEliimnar
        openModalEliminar={openModalEliminar}
        setOpenModalEliminar={setOpenModalEliminar}
        confirmarEliminarMarca={confirmarEliminarMarca}
      />

      <Sidebar />
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper className="col-md-6 col-lg-6 col-xl-6" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Marcas Registradas</h3>

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
                {marcas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((marca) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={marca.marcaId}>
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
                                  onClick={() => handleEditarMarca(marca)}
                                />
                                <img
                                  src={drop}
                                  alt="Eliminar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEliminarMarca(marca.marcaId)}
                                />
                              </div>
                            </TableCell>
                          );
                        } else {
                          const value = marca[column.id];
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
            count={marcas.length}
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
export default Marcas;
