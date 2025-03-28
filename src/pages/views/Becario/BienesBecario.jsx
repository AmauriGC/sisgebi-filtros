import React, { useState, useEffect } from "react";
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
import ver from "../../../assets/img/eye-outline.svg";
import SidebarBecario from "../../../components/SidebarBecario";
import { jwtDecode } from "jwt-decode"; // Importa jwtDecode para decodificar el token
import Swal from "sweetalert2";

const Bienes = () => {
  const [bienes, setBienes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bienSeleccionado, setBienSeleccionado] = useState(null);
  const [openModalVer, setOpenModalVer] = useState(false);
  const [id, setUserId] = useState(null); // Estado para guardar el ID del usuario
  const navigate = useNavigate();

  const columns = [
    { id: "bienId", label: "#", minWidth: 25 },
    { id: "codigo", label: "Código", minWidth: 40 },
    { id: "numeroSerie", label: "No. Serie", minWidth: 40 },
    { id: "disponibilidad", label: "Disponibilidad", minWidth: 60 },
    { id: "status", label: "Estado", minWidth: 60 },
    { id: "acciones", label: "Acciones", minWidth: 50 },
  ];

  // Cargar los bienes al montar el componente
  // Obtener el ID del usuario al montar el componente
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

    setUserId(decodedToken.id); // Guardar el ID del usuario
    obtenerBienes();
  }, [navigate]);

  React.useEffect(() => {
    aplicarFiltros();
  }, []);

  // Aplicar filtros adicionales si es necesario
  const aplicarFiltros = () => {
    const params = {};

    const token = sessionStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8080/api/bienes/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        // Aplicar el filtro adicional de disponibilidad "DISPONIBLE" y estado "ACTIVO"
        const bienesFiltrados = response.data.filter(
          (bien) => bien.disponibilidad === "DISPONIBLE" && bien.status === "ACTIVO"
        );
        setBienes(bienesFiltrados);
      })
      .catch((error) => {
        console.error("Error al filtrar los bienes:", error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Obtener los bienes con disponibilidad "DISPONIBLE" y estado "ACTIVO"
  const obtenerBienes = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8080/api/bienes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const bienesFiltrados = response.data.filter(
          (bien) => bien.disponibilidad === "DISPONIBLE" && bien.status === "ACTIVO"
        );
        setBienes(bienesFiltrados);
      })
      .catch((error) => {
        console.error("Error al obtener los bienes:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los bienes. Inténtalo de nuevo más tarde.",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  const handleVerBien = (bien) => {
    setBienSeleccionado(bien);
    setOpenModalVer(true);
  };

  const handleCrearAsignacion = async () => {
    if (!bienSeleccionado || !id) return;
  
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Por favor, inicia sesión nuevamente",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => navigate("/"));
      return;
    }
  
    try {
      // Primero obtener los objetos completos de usuario y bien
      const [usuarioResponse, bienResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:8080/api/bienes/${bienSeleccionado.bienId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
  
      const usuario = usuarioResponse.data;
      const bien = bienResponse.data;
  
      const confirmacion = await Swal.fire({
        title: "¿Confirmar asignación?",
        text: `¿Deseas asignar el bien ${bien.codigo} a tu cuenta?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#254B5E",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, asignar",
        cancelButtonText: "Cancelar",
      });
  
      if (confirmacion.isConfirmed) {
        const asignacionData = {
          usuario: usuario, // Enviar objeto usuario completo
          bien: bien, // Enviar objeto bien completo
          fechaAsignacion: new Date().toISOString(),
          status: "ACTIVO",
        };
  
        const response = await axios.post(
          "http://localhost:8080/api/asignaciones",
          asignacionData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }
        );
  
        await Swal.fire({
          icon: "success",
          title: "Asignación exitosa",
          text: "El bien ha sido asignado correctamente.",
          showConfirmButton: false,
          timer: 3000,
        });
  
        // Actualizar la lista de bienes y cerrar el modal
        obtenerBienes();
        setOpenModalVer(false);
      }
    } catch (error) {
      console.error("Error en la asignación:", error);
      
      let errorMessage = "Ocurrió un error al procesar la asignación";
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = "No tienes permiso para realizar esta acción";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
  
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: false,
        timer: 3000,
      });
    }
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
      {/* Modal para ver detalles de un bien */}
      <Modal
        open={openModalVer}
        onClose={() => setOpenModalVer(false)}
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
            {/* Lista de detalles del bien */}
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
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Disponibilidad:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.disponibilidad}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0", pb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Motivo:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.motivo}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Fecha de eliminación:
                </Typography>
                <Typography variant="body1">
                  {bienSeleccionado?.deleteAt ? new Date(bienSeleccionado?.deleteAt).toLocaleString() : "No eliminado"}
                </Typography>
              </Box>
            </Box>

            {/* Botón de Cerrar */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "20px" }}>
              <button
                onClick={() => setOpenModalVer(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#c2c2c2",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cerrar
              </button>
              <button
                onClick={handleCrearAsignacion} // Llamar a la función aquí
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#254B5E",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Asignar
              </button>
            </Box>
          </Typography>
        </Box>
      </Modal>

      <SidebarBecario />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
        <Paper className="col-md-8 col-lg-8 col-xl-8" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Bienes existentes</h3>
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
                {bienes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bien) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={bien.bienId}>
                      {columns.map((column) => {
                        if (column.id === "acciones") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <div style={{ display: "flex" }}>
                                <img
                                  src={ver}
                                  alt="Ver"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleVerBien(bien)}
                                />
                              </div>
                            </TableCell>
                          );
                        } else {
                          const value =
                            column.id === "tipoBien"
                              ? bien.tipoBien?.nombreTipoBien
                              : column.id === "marca"
                              ? bien.marca?.nombreMarca
                              : column.id === "modelo"
                              ? bien.modelo?.nombreModelo
                              : column.id === "areaComun"
                              ? bien.areaComun?.nombreArea
                              : bien[column.id];
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
            count={bienes.length}
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
export default Bienes;
