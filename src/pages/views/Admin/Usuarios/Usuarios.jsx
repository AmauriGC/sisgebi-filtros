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
import UsuarioModalCrear from "./Components/UsuarioModalCrear";
import UsuarioModalEditar from "./Components/UsuarioModalEditar";
import UsuarioModalEliminar from "./Components/UsuarioModalEliminar";
import Swal from "sweetalert2";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroRol, setFiltroRol] = useState(null);
  const [filtroLugar, setFiltroLugar] = useState(null);
  const [lugarOptions, setLugarOptions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [openModalCrear, setOpenModalCrear] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    contrasena: "",
    rol: "",
    status: "ACTIVO",
    lugar: "",
  });

  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const rolOptions = [
    { value: "ADMINISTRADOR", label: "Administrador" },
    { value: "RESPONSABLE", label: "Responsable" },
    { value: "BECARIO", label: "Becario" },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los usuarios:", error);
        window.location.href = "/";
      });

    axios
      .get("http://localhost:8080/api/usuarios/lugares", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const lugares = response.data.map((lugar) => ({
          value: lugar,
          label: lugar,
        }));
        setLugarOptions(lugares);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los lugares:", error);
        window.location.href = "/";
      });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filtroStatus, filtroRol, filtroLugar]);

  const applyFilters = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;
    if (filtroRol) params.rol = filtroRol.value;
    if (filtroLugar) params.lugar = filtroLugar.value;

    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("No se encontró un token válido.");
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:8080/api/usuarios/filter", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al filtrar los usuarios:", error);
        if (error.response && error.response.status === 403) {
          console.error("Token no válido, redirigiendo al login.");
          window.location.href = "/";
        }
      });
  };

  const resetFilters = () => {
    setFiltroStatus(null);
    setFiltroRol(null);
    setFiltroLugar(null);
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    axios
      .get("http://localhost:8080/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los usuarios:", error);
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

  const handleCrearUsuario = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    axios
      .post("http://localhost:8080/api/usuarios", nuevoUsuario, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Agregar el nuevo usuario al estado
        setUsuarios([...usuarios, response.data]);

        // Cerrar el modal y resetear el formulario
        setOpenModalCrear(false);
        setNuevoUsuario({
          nombres: "",
          apellidos: "",
          correo: "",
          contrasena: "",
          rol: "",
          status: "ACTIVO",
          lugar: "",
        });

        // Mostrar alerta de éxito
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Usuario creado correctamente",
          showConfirmButton: false,
          timer: 2000, // Cierra automáticamente después de 2 segundos
        });
      })
      .catch((error) => {
        console.error("Hubo un error al crear el usuario:", error);

        // Mostrar alerta de error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo crear el usuario",
          footer: '<a href="#">¿Por qué tengo este problema?</a>',
        });
      });
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setOpenModalEditar(true);
  };

  const handleActualizarUsuario = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !usuarioSeleccionado) return;

    // Crear un objeto para enviar al backend, excluyendo la contraseña hasheada
    const usuarioActualizado = {
      ...usuarioSeleccionado,
      contrasena: usuarioSeleccionado.nuevaContrasena || null, // Envía la nueva contraseña solo si existe
    };

    axios
      .put(`http://localhost:8080/api/usuarios/${usuarioSeleccionado.id}`, usuarioActualizado, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Actualizar el usuario en el estado
        setUsuarios(usuarios.map((u) => (u.id === usuarioSeleccionado.id ? response.data : u)));

        // Cerrar el modal de edición
        setOpenModalEditar(false);

        // Mostrar alerta de éxito
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Usuario actualizado correctamente",
          showConfirmButton: false,
          timer: 2000, // Cierra automáticamente después de 2 segundos
        });
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el usuario:", error);

        // Mostrar alerta de error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo actualizar el usuario",
          footer: '<a href="#">¿Por qué tengo este problema?</a>',
        });
      });
  };

  const handleEliminarUsuario = (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    setUsuarioSeleccionado(usuario);
    setOpenModalEliminar(true);
  };

  const confirmarEliminarUsuario = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !usuarioSeleccionado) return;

    // Cerrar el modal de eliminación
    setOpenModalEliminar(false);

    axios
      .delete(`http://localhost:8080/api/usuarios/${usuarioSeleccionado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Actualizar el estado del usuario a INACTIVO
        setUsuarios(usuarios.map((u) => (u.id === usuarioSeleccionado.id ? { ...u, status: "INACTIVO" } : u)));

        // Cerrar el modal de eliminación
        setOpenModalEliminar(false);

        // Mostrar alerta de éxito
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El usuario ha sido eliminado",
          showConfirmButton: false,
          timer: 2000, // Cierra automáticamente después de 2 segundos
        });
      })
      .catch(() => {
        // Mostrar alerta de error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se ha podido eliminar el usuario",
          footer: '<a href="#">¿Por qué tengo este problema?</a>',
        });
      });
  };

  const columns = [
    { id: "id", label: "#", minWidth: 50 },
    { id: "nombres", label: "Nombres", minWidth: 100 },
    { id: "apellidos", label: "Apellidos", minWidth: 100 },
    { id: "correo", label: "Correo", minWidth: 100 },
    { id: "rol", label: "Rol", minWidth: 100 },
    { id: "lugar", label: "Lugar", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 100 },
    { id: "acciones", label: "Acciones", minWidth: 50 },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear usuario */}
      <UsuarioModalCrear
        openModalCrear={openModalCrear}
        setOpenModalCrear={setOpenModalCrear}
        nuevoUsuario={nuevoUsuario}
        setNuevoUsuario={setNuevoUsuario}
        rolOptions={rolOptions}
        handleCrearUsuario={handleCrearUsuario}
      />

      {/* Modal para editar usuario */}
      <UsuarioModalEditar
        openModalEditar={openModalEditar}
        setOpenModalEditar={setOpenModalEditar}
        usuarioSeleccionado={usuarioSeleccionado}
        setUsuarioSeleccionado={setUsuarioSeleccionado}
        statusOptions={statusOptions}
        handleActualizarUsuario={handleActualizarUsuario}
      />

      {/* Modal para eliminar usuario */}
      <UsuarioModalEliminar
        openModalEliminar={openModalEliminar}
        setOpenModalEliminar={setOpenModalEliminar}
        confirmarEliminarUsuario={confirmarEliminarUsuario}
      />

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper className="col-md-8 col-lg-10 col-xl-10" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Usuarios existentes</h3>

            {/* Contenedor principal con distribución adecuada */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/* Filtros alineados a la izquierda */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>
                <Select
                  placeholder="Rol"
                  value={filtroRol}
                  onChange={setFiltroRol}
                  options={rolOptions}
                  styles={customSelectStyles}
                />
                <Select
                  placeholder="Lugar"
                  value={filtroLugar}
                  onChange={setFiltroLugar}
                  options={lugarOptions}
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
                {usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((usuario) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={usuario.id}>
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
                                  onClick={() => handleEditarUsuario(usuario)}
                                />
                                <img
                                  src={drop}
                                  alt="Eliminar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEliminarUsuario(usuario.id)}
                                />
                              </div>
                            </TableCell>
                          );
                        } else {
                          const value = usuario[column.id];
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
            count={usuarios.length}
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

export default Usuarios;
