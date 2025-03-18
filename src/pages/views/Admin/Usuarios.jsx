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
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [colorAlerta, setColorAlerta] = useState("");

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
          rol: "",
          status: "ACTIVO",
          lugar: "",
        });

        // Mostrar mensaje de éxito
        setMensajeAlerta("Usuario creado correctamente");
        setColorAlerta("#64C267"); // Color verde para éxito

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Hubo un error al crear el usuario:", error);

        // Mostrar mensaje de error
        setMensajeAlerta("No se pudo crear el usuario");
        setColorAlerta("#C26464"); // Color rojo para error

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
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

        // Mostrar mensaje de éxito
        setMensajeAlerta("Usuario actualizado correctamente");
        setColorAlerta("#64C267");

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el usuario:", error);

        // Mostrar mensaje de error
        setMensajeAlerta("No se pudo actualizar el usuario");
        setColorAlerta("#C26464");

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
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

    // Solo envía el ID del usuario
    axios
      .delete(`http://localhost:8080/api/usuarios/${usuarioSeleccionado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Actualizar el estado del usuario a INACTIVO
        setUsuarios(usuarios.map((u) => (u.id === usuarioSeleccionado.id ? { ...u, status: "INACTIVO" } : u)));

        // Cerrar el modal de eliminación
        setOpenModalEliminar(false);

        // Mostrar mensaje de éxito
        setMensajeAlerta("El usuario se ha eliminado correctamente");
        setColorAlerta("#64C267");

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      })
      .catch(() => {
        // Mostrar mensaje de error
        setMensajeAlerta("No se ha podido eliminar el usuario");
        setColorAlerta("#C26464");

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
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
      <Modal
        open={openModalCrear}
        onClose={() => setOpenModalCrear(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            <strong>Registrar usuario</strong>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCrearUsuario();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Nombre:</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nuevoUsuario.nombres}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombres: e.target.value })}
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Apellidos:</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Apellidos"
                    value={nuevoUsuario.apellidos}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellidos: e.target.value })}
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Correo:</strong>
                  </label>
                  <input
                    type="email"
                    placeholder="Correo"
                    value={nuevoUsuario.correo}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Contraseña:</strong>
                  </label>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={nuevoUsuario.contrasena}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })}
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Rol:</strong>
                  </label>
                  <Select
                    options={rolOptions}
                    placeholder="Seleccione un rol"
                    value={rolOptions.find((option) => option.value === nuevoUsuario.rol)}
                    onChange={(selected) => setNuevoUsuario({ ...nuevoUsuario, rol: selected.value })}
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Lugar:</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Lugar"
                    value={nuevoUsuario.lugar}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, lugar: e.target.value })}
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

      {/* Modal para editar usuario */}
      <Modal
        open={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            <strong>Editar Usuario</strong>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleActualizarUsuario();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Nombres:</strong>
                  </label>
                  <input
                    type="text"
                    value={usuarioSeleccionado?.nombres || ""}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        nombres: e.target.value,
                      })
                    }
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Apellidos:</strong>
                  </label>
                  <input
                    type="text"
                    value={usuarioSeleccionado?.apellidos || ""}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        apellidos: e.target.value,
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
                    <strong>Correo:</strong>
                  </label>
                  <input
                    type="email"
                    value={usuarioSeleccionado?.correo || ""}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        correo: e.target.value,
                      })
                    }
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Nueva Contraseña: (Opcional)</strong>
                  </label>
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        nuevaContrasena: e.target.value,
                      })
                    }
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>{" "}
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Estado:</strong>
                  </label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === usuarioSeleccionado?.status)}
                    onChange={(selected) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        status: selected.value,
                      })
                    }
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Lugar:</strong>
                  </label>
                  <input
                    type="text"
                    value={usuarioSeleccionado?.lugar || ""}
                    onChange={(e) =>
                      setUsuarioSeleccionado({
                        ...usuarioSeleccionado,
                        lugar: e.target.value,
                      })
                    }
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                <button
                  onClick={() => setOpenModalEditar(false)}
                  type="button"
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

      {/* Modal para eliminar usuario */}
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
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminar Usuario
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar este usuario?
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
              onClick={confirmarEliminarUsuario}
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
                            <TableCell key={column.id} align={column.align}>
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

export default Usuarios;
