import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
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
import edit from "../../../../assets/img/pencil.svg";
import drop from "../../../../assets/img/delete.svg";
import Sidebar from "../../../../components/Sidebar";
import Swal from "sweetalert2";
import ModeloModalCrear from "./Components/ModeloModalCrear";
import ModeloModalEditar from "./Components/ModeloModalEditar";
import ModeloModalEliminar from "./Components/ModeloModalEliminar";
import { jwtDecode } from "jwt-decode";

const Modelos = () => {
  const [modelos, setModelos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [openModalCrear, setOpenModalCrear] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const statusActivoOptions = [{ value: "ACTIVO", label: "Activo" }];

  const isFormValid = () => {
    return nuevoModelo.nombreModelo.trim() !== "";
  };

  const isUpdateFormValid = () => {
    return modeloSeleccionado.nombreModelo.trim() !== "";
  };

  const [nuevoModelo, setNuevoModelo] = useState({
    nombreModelo: "",
    foto: "",
    status: "ACTIVO",
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "warning",
        title: "Formato no soportado",
        text: "Solo se permiten imágenes JPEG, PNG o JPG.",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "El archivo es demasiado grande. El límite es 10MB.",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setNuevoModelo({
        ...nuevoModelo,
        foto: file,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

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
      .get("http://localhost:8080/api/modelo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModelos(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar los modelos",
          text: "Hubo un problema al intentar obtener los modelos. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
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
      .get("http://localhost:8080/api/modelo/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        setModelos(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al filtrar los modelos",
          text: "Hubo un problema al intentar filtrar los modelos. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const resetFilters = () => {
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
      .get("http://localhost:8080/api/modelo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModelos(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al filtrar los modelos",
          text: "Hubo un problema al intentar filtrar los modelos. Por favor, inténtalo de nuevo más tarde.",
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

  const handleCrearModelo = () => {
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

    const formData = new FormData();
    formData.append("nombreModelo", nuevoModelo.nombreModelo);
    formData.append("status", nuevoModelo.status);
    if (nuevoModelo.foto) {
      formData.append("foto", nuevoModelo.foto);
    }

    axios
      .post("http://localhost:8080/api/modelo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setModelos([...modelos, response.data]);
        setOpenModalCrear(false);
        setNuevoModelo({ nombreModelo: "", status: "ACTIVO", foto: null });

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Modelo creado correctamente",
          showConfirmButton: true,
          timer: 3000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo crear el modelo.",
          showConfirmButton: true,
        });
      });
  };

  const handleEditarModelo = (modelo) => {
    setModeloSeleccionado(modelo);
    setOpenModalEditar(true);
  };

  const handleActualizarModelo = () => {
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

    if (!modeloSeleccionado) return;

    // Crear FormData para enviar la imagen
    const formData = new FormData();
    formData.append("nombreModelo", modeloSeleccionado.nombreModelo);
    formData.append("status", modeloSeleccionado.status);

    // Solo agregar la foto si se seleccionó una nueva
    if (modeloSeleccionado.foto && modeloSeleccionado.foto instanceof File) {
      formData.append("foto", modeloSeleccionado.foto);
    }

    axios
      .put(`http://localhost:8080/api/modelo/${modeloSeleccionado.modeloId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setModelos(modelos.map((modelo) => (modelo.modeloId === modeloSeleccionado.modeloId ? response.data : modelo)));

        setOpenModalEditar(false);
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Modelo actualizado correctamente",
          showConfirmButton: true,
          timer: 3000,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo actualizar el modelo. Por favor, verifica los datos e inténtalo de nuevo.",
          showConfirmButton: true,
        });
      });
  };

  // Cuando cambies la imagen en el formulario
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModeloSeleccionado({
        ...modeloSeleccionado,
        foto: file,
      });
    }
  };

  const handleEliminarModelo = (id) => {
    const modelo = modelos.find((modelo) => modelo.modeloId === id);
    setModeloSeleccionado(modelo);
    setOpenModalEliminar(true);
  };

  const confirmarEliminarModelo = () => {
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

    if (!modeloSeleccionado) return;

    axios
      .delete(`http://localhost:8080/api/modelo/${modeloSeleccionado.modeloId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setModelos(
          modelos.map((modelo) =>
            modelo.modeloId === modeloSeleccionado.modeloId ? { ...modelo, status: "INACTIVO" } : modelo
          )
        );

        setOpenModalEliminar(false);

        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "Modelo eliminado correctamente",
          showConfirmButton: true,
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error("Hubo un error al eliminar el modelo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al eliminar el modelo. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const columns = [
    { id: "modeloId", label: "#", minWidth: 50 },
    { id: "nombreModelo", label: "Nombre", minWidth: 100 },
    { id: "foto", label: "Imagen", minWidth: 100 },
    { id: "status", label: "Estado", minWidth: 100 },
    { id: "acciones", label: "Acciones", minWidth: 50 },
  ];

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear modelo */}
      <ModeloModalCrear
        openModalCrear={openModalCrear}
        setOpenModalCrear={setOpenModalCrear}
        nuevoModelo={nuevoModelo}
        setNuevoModelo={setNuevoModelo}
        handleCrearModelo={handleCrearModelo}
        isFormValid={isFormValid}
        handleFileChange={handleFileChange}
      />

      {/* Modal para editar modelo */}
      <ModeloModalEditar
        openModalEditar={openModalEditar}
        setOpenModalEditar={setOpenModalEditar}
        modeloSeleccionado={modeloSeleccionado}
        setModeloSeleccionado={setModeloSeleccionado}
        statusActivoOptions={statusActivoOptions}
        handleActualizarModelo={handleActualizarModelo}
        isUpdateFormValid={isUpdateFormValid}
        handleImageChange={handleImageChange}
      />

      {/* Modal para eliminar modelo */}
      <ModeloModalEliminar
        openModalEliminar={openModalEliminar}
        setOpenModalEliminar={setOpenModalEliminar}
        handleEliminarModelo={handleEliminarModelo}
        confirmarEliminarModelo={confirmarEliminarModelo}
      />

      {/* Modal para visualizar imagen en grande */}
      {openImageModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setOpenImageModal(false)}
        >
          <div
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={selectedImage}
              alt="Modelo en grande"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            />
            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#546EAB",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => setOpenImageModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper sx={{ overflow: "hidden" }} className="col-md-8 col-lg-6 col-xl-6" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Modelos Registrados</h3>

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
                {modelos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((modelo) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={modelo.modeloId}>
                      {columns.map((column) => {
                        if (column.id === "acciones") {
                          return (
                            <TableCell key={column.id} align="center">
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
                                  onClick={() => handleEditarModelo(modelo)}
                                />
                                <img
                                  src={drop}
                                  alt="Eliminar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEliminarModelo(modelo.modeloId)}
                                />
                              </div>
                            </TableCell>
                          );
                        } else if (column.id === "foto") {
                          return (
                            <TableCell key={column.id} align="center">
                              {modelo.foto ? (
                                <img
                                  src={`data:image/${
                                    modelo.foto.includes("image/")
                                      ? modelo.foto.split("image/")[1].split(";")[0]
                                      : "jpeg"
                                  };base64,${modelo.foto}`}
                                  alt="Modelo"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "5px",
                                    objectFit: "scale-down",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setSelectedImage(
                                      `data:image/${
                                        modelo.foto.includes("image/")
                                          ? modelo.foto.split("image/")[1].split(";")[0]
                                          : "jpeg"
                                      };base64,${modelo.foto}`
                                    );
                                    setOpenImageModal(true);
                                  }}
                                />
                              ) : (
                                "Sin imagen"
                              )}
                            </TableCell>
                          );
                        } else {
                          const value = modelo[column.id];
                          return (
                            <TableCell key={column.id} align="left" style={{ fontSize: "12px" }}>
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
            count={modelos.length}
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

export default Modelos;
