import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
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
import TipoModalCrear from "./Components/TipoModalCrear";
import TipoModalEditar from "./Components/TipoModalEditar";
import TipoModalEliminar from "./Components/TipoModalEliminar";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

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
      .get("http://localhost:8080/api/tipo-bien", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTipoBienes(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar los tipos de bien",
          text: "Hubo un problema al intentar obtener los tipos de bien. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
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
      .get("http://localhost:8080/api/tipo-bien/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        setTipoBienes(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al filtrar los tipos de bien",
          text: "Hubo un problema al intentar filtrar los tipos de bien. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
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
      .get("http://localhost:8080/api/tipo-bien", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTipoBienes(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar los tipos de bien",
          text: "Hubo un problema al intentar obtener los tipos de bien. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCrearTipoBien = () => {
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
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Tipo de bien creado correctamente",
          showConfirmButton: true,
          timer: 3000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo crear el tipo de bien. Por favor, verifica los datos e inténtalo de nuevo.",
          showConfirmButton: true,
        });
      });
  };

  const handleEditarTipoBien = (tipoBien) => {
    setTipoBienSeleccionado(tipoBien);
    setOpenModalEditar(true);
  };

  const handleActualizarTipoBien = () => {
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

    if (!tipoBienSeleccionado) return;

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
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Tipo de bien actualizado correctamente",
          showConfirmButton: true,
          timer: 3000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo actualizar el tipo de bien. Por favor, verifica los datos e inténtalo de nuevo.",
          showConfirmButton: true,
        });
      });
  };

  const handleEliminarTipoBien = (id) => {
    const tipoBien = tipoBienes.find((tipo) => tipo.tipoBienId === id);
    setTipoBienSeleccionado(tipoBien);
    setOpenModalEliminar(true);
  };

  const confirmarEliminarTipoBien = () => {
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

    if (!tipoBienSeleccionado) return;

    axios
      .delete(`http://localhost:8080/api/tipo-bien/${tipoBienSeleccionado.tipoBienId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setTipoBienes(
          tipoBienes.map((tipo) =>
            tipo.tipoBienId === tipoBienSeleccionado.tipoBienId ? { ...tipo, status: "INACTIVO" } : tipo
          )
        );

        setOpenModalEliminar(false);
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El tipo de bien ha sido eliminado",
          showConfirmButton: true,
          timer: 3000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se ha podido eliminar el tipo de bien. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const columns = [
    { id: "tipoBienId", label: "#", minWidth: 20 },
    { id: "nombreTipoBien", label: "Nombre", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 80 },
    { id: "acciones", label: "Acciones", minWidth: 50 },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear tipo de bien */}
      <TipoModalCrear
        openModalCrear={openModalCrear}
        setOpenModalCrear={setOpenModalCrear}
        nuevoTipoBien={nuevoTipoBien}
        setNuevoTipoBien={setNuevoTipoBien}
        handleCrearTipoBien={handleCrearTipoBien}
      />

      {/* Modal para editar tipo de bien */}
      <TipoModalEditar
        openModalEditar={openModalEditar}
        setOpenModalEditar={setOpenModalEditar}
        tipoBienSeleccionado={tipoBienSeleccionado}
        setTipoBienSeleccionado={setTipoBienSeleccionado}
        statusOptions={statusOptions}
        handleActualizarTipoBien={handleActualizarTipoBien}
      />

      {/* Modal para eliminar tipo de bien */}
      <TipoModalEliminar
        openModalEliminar={openModalEliminar}
        setOpenModalEliminar={setOpenModalEliminar}
        handleEliminarTipoBien={handleEliminarTipoBien}
        confirmarEliminarTipoBien={confirmarEliminarTipoBien}
      />

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper sx={{ overflow: "hidden" }} className="col-md-6 col-lg-6 col-xl-6" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Tipos de Bien Registrados</h3>

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
                <button onClick={resetearFiltros} style={{ ...buttonStyle, backgroundColor: "#546EAB" }}>
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
                {tipoBienes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tipo) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={tipo.tipoBienId}>
                      {columns.map((column) => {
                        if (column.id === "acciones") {
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
                              </div>
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

export default Tipos;
