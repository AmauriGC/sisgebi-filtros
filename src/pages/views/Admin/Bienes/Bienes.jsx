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
import Box from "@mui/material/Box";
import ver from "../../../../assets/img/eye-outline.svg";
import edit from "../../../../assets/img/pencil.svg";
import drop from "../../../../assets/img/delete.svg";
import Sidebar from "../../../../components/Sidebar";

import BienModalCrear from "./Components/BienModalCrear";
import BienModalEditar from "./Components/BienModalEditar";
import BienModalEliminar from "./Components/BienModalEliminar";
import BienModalVer from "./Components/BienModalVer";
import Swal from "sweetalert2";

const Bienes = () => {
  const [bienes, setBienes] = React.useState([]);
  const [filtroStatus, setFiltroStatus] = React.useState(null);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = React.useState(null);

  const [areaComunOptions, setAreaComunOptions] = React.useState([]);
  const [tipoBienOptions, setTipoBienOptions] = React.useState([]);
  const [marcaOptions, setMarcaOptions] = React.useState([]);
  const [modeloOptions, setModeloOptions] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const navigate = useNavigate();

  const [bienSeleccionado, setBienSeleccionado] = React.useState(null);
  const [motivoEliminar, setMotivoEliminar] = React.useState("");

  const [openModalEditar, setOpenModalEditar] = React.useState(false);
  const [openModalEliminar, setOpenModalEliminar] = React.useState(false);
  const [openModalCrear, setOpenModalCrear] = React.useState(false);
  const [openModalVer, setOpenModalVer] = React.useState(false);

  const [nuevoBien, setNuevoBien] = React.useState({
    codigo: "",
    numeroSerie: "",
    tipoBien: null,
    marca: null,
    modelo: null,
    areaComun: null,
    status: "ACTIVO",
    disponibilidad: "DISPONIBLE",
    motivo: "",
  });

  const statusOptions = [
    { value: "ACTIVO", label: "Activo" },
    { value: "INACTIVO", label: "Inactivo" },
  ];

  const disponibilidadOptions = [
    { value: "DISPONIBLE", label: "Disponible" },
    { value: "OCUPADO", label: "Ocupado" },
  ];

  const columns = [
    { id: "bienId", label: "#", minWidth: 25 },
    { id: "codigo", label: "Código", minWidth: 40 },
    { id: "numeroSerie", label: "No. Serie", minWidth: 40 },
    { id: "disponibilidad", label: "Disponibilidad", minWidth: 60 },
    { id: "status", label: "Estado", minWidth: 60 },
    { id: "acciones", label: "Acciones", minWidth: 50 },
  ];

  React.useEffect(() => {
    obtenerBienes();
    cargarOpcionesFiltros();
  }, []);

  React.useEffect(() => {
    aplicarFiltros();
  }, [filtroStatus, filtroDisponibilidad]);

  const obtenerBienes = () => {
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

    axios
      .get("http://localhost:8080/api/bienes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBienes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los bienes:", error);
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

    // Cargar áreas comunes
    axios
      .get("http://localhost:8080/api/areas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAreaComunOptions(
          response.data.map((area) => ({
            value: area.areaId,
            label: area.nombreArea,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar áreas comunes:", error);
      });

    // Cargar tipos de bien
    axios
      .get("http://localhost:8080/api/tipo-bien", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTipoBienOptions(
          response.data.map((tipo) => ({
            value: tipo.tipoBienId,
            label: tipo.nombreTipoBien,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar tipos de bien:", error);
      });

    // Cargar marcas
    axios
      .get("http://localhost:8080/api/marca", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setMarcaOptions(
          response.data.map((marca) => ({
            value: marca.marcaId,
            label: marca.nombreMarca,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar marcas:", error);
      });

    // Cargar modelos
    axios
      .get("http://localhost:8080/api/modelo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModeloOptions(
          response.data.map((modelo) => ({
            value: modelo.modeloId,
            label: modelo.nombreModelo,
          }))
        );
      })
      .catch((error) => {
        console.error("Error al cargar modelos:", error);
      });
  };

  const aplicarFiltros = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;
    if (filtroDisponibilidad) params.disponibilidad = filtroDisponibilidad.value;
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

    axios
      .get("http://localhost:8080/api/bienes/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        setBienes(response.data);
      })
      .catch((error) => {
        console.error("Error al filtrar los bienes:", error);
      });
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
    setFiltroDisponibilidad(null);
    setFiltroAreaComun(null);
    setFiltroTipoBien(null);
    setFiltroMarca(null);
    setFiltroModelo(null);
    obtenerBienes();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCrear = () => {
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

    const bienParaEnviar = {
      codigo: nuevoBien.codigo,
      numeroSerie: nuevoBien.numeroSerie,
      tipoBien: { tipoBienId: nuevoBien.tipoBien.value },
      marca: { marcaId: nuevoBien.marca.value },
      modelo: { modeloId: nuevoBien.modelo.value },
      areaComun: { areaId: nuevoBien.areaComun.value },
      status: nuevoBien.status,
      disponibilidad: nuevoBien.disponibilidad,
      motivo: "",
    };

    axios
      .post("http://localhost:8080/api/bienes", bienParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Agregar el nuevo bien al estado
        setBienes([...bienes, response.data]);

        // Cerrar el modal y resetear el formulario
        setOpenModalCrear(false);
        setNuevoBien({
          codigo: "",
          numeroSerie: "",
          tipoBien: null,
          marca: null,
          modelo: null,
          areaComun: null,
          status: "ACTIVO",
          disponibilidad: "DISPONIBLE",
          motivo: "",
        });

        // Mostrar alerta de éxito
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Bien creado correctamente",
          showConfirmButton: false,
          timer: 3000, // Cierra automáticamente después de 2 segundos
        });
      })
      .catch((error) => {
        console.error("Hubo un error al crear el bien:", error.response?.data || error.message);

        // Mostrar alerta de error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo crear el bien",
          footer: '<a href="#">¿Por qué tengo este problema?</a>',
        });
      });
  };

  const handleEditarBien = (bien) => {
    setBienSeleccionado({
      ...bien,
      motivo: bien.motivo || "", // Asegúrate de que 'motivo' tenga un valor predeterminado vacío
    });
    setOpenModalEditar(true);
  };

  const handleActualizar = () => {
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
    if (!bienSeleccionado) return;

    const bienParaActualizar = {
      ...bienSeleccionado,
      motivo: bienSeleccionado.motivo || "", // Si 'motivo' no existe, asignamos ""
    };

    axios
      .put(`http://localhost:8080/api/bienes/${bienSeleccionado.bienId}`, bienParaActualizar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Actualizar el bien en el estado
        setBienes(bienes.map((bien) => (bien.bienId === bienSeleccionado.bienId ? response.data : bien)));

        // Cerrar el modal de edición
        setOpenModalEditar(false);

        // Mostrar alerta de éxito
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Bien actualizado correctamente",
          showConfirmButton: false,
          timer: 3000, // Cierra automáticamente después de 2 segundos
        });
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el bien:", error);

        // Mostrar alerta de error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo actualizar el bien",
          footer: '<a href="#">¿Por qué tengo este problema?</a>',
        });
      });
  };

  const handleEliminarBien = (bienId) => {
    const bien = bienes.find((bien) => bien.bienId === bienId);
    setBienSeleccionado(bien);
    setOpenModalEliminar(true);
  };

  const confirmarEliminar = () => {
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
    if (!bienSeleccionado || !motivoEliminar) return;

    axios
      .put(
        `http://localhost:8080/api/bienes/${bienSeleccionado.bienId}`,
        { ...bienSeleccionado, status: "INACTIVO", motivo: motivoEliminar }, // Envía el motivo y el nuevo estado
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        // Reemplazar el bien en el estado con la nueva versión (INACTIVO)
        const bienActualizado = response.data;
        setBienes(bienes.map((bien) => (bien.bienId === bienActualizado.bienId ? bienActualizado : bien)));

        // Cerrar el modal de eliminación
        setOpenModalEliminar(false);

        // Mostrar alerta de éxito
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El bien ha sido eliminado",
          showConfirmButton: false,
          timer: 3000, // Cierra automáticamente después de 2 segundos
        });
      })
      .catch((error) => {
        console.error("Error al eliminar el bien:", error);

        // Mostrar alerta de error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se ha podido eliminar el bien",
          footer: '<a href="#">¿Por qué tengo este problema?</a>',
        });
      });
  };

  const handleVerBien = (bien) => {
    // Mostrar alerta antes de abrir el modal
    Swal.fire({
      icon: "info",
      title: "Detalles del Bien",
      text: "Mostrando detalles del bien seleccionado",
      showConfirmButton: false,
      timer: 1500, // Cierra automáticamente después de 1.5 segundos
    }).then(() => {
      setBienSeleccionado(bien); // Establece el bien seleccionado

      setOpenModalVer(true); // Abre el modal de detalles
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
      {/* Modal para crear bien */}
      <BienModalCrear
        openModalCrear={openModalCrear}
        setOpenModalCrear={setOpenModalCrear}
        nuevoBien={nuevoBien}
        setNuevoBien={setNuevoBien}
        tipoBienOptions={tipoBienOptions}
        marcaOptions={marcaOptions}
        modeloOptions={modeloOptions}
        areaComunOptions={areaComunOptions}
        statusOptions={statusOptions}
        disponibilidadOptions={disponibilidadOptions}
        handleCrear={handleCrear}
      />

      {/* Modal para editar bien */}
      <BienModalEditar
        openModalEditar={openModalEditar}
        setOpenModalEditar={setOpenModalEditar}
        bienSeleccionado={bienSeleccionado}
        setBienSeleccionado={setBienSeleccionado}
        tipoBienOptions={tipoBienOptions}
        marcaOptions={marcaOptions}
        modeloOptions={modeloOptions}
        areaComunOptions={areaComunOptions}
        statusOptions={statusOptions}
        disponibilidadOptions={disponibilidadOptions}
        handleActualizar={handleActualizar}
      />

      {/* Modal para eliminar bien */}
      <BienModalEliminar
        openModalEliminar={openModalEliminar}
        motivoEliminar={motivoEliminar}
        setMotivoEliminar={setMotivoEliminar}
        setOpenModalEliminar={setOpenModalEliminar}
        confirmarEliminar={confirmarEliminar}
      />

      {/* Modal para ver detalles de un bien */}
      <BienModalVer openModalVer={openModalVer} setOpenModalVer={setOpenModalVer} bienSeleccionado={bienSeleccionado} />

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
        <Paper className="col-md-8 col-lg-8 col-xl-8" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Bienes existentes</h3>

            {/* Contenedor principal con distribución adecuada */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/* Filtros alineados a la izquierda */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>
                {/* Primera fila de filtros */}
                <Select
                  placeholder="Disponibilidad"
                  value={filtroDisponibilidad}
                  onChange={setFiltroDisponibilidad}
                  options={disponibilidadOptions}
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
                                    marginRight: "8px",
                                  }}
                                  onClick={() => handleVerBien(bien)}
                                />
                                <img
                                  src={edit}
                                  alt="Editar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                    marginRight: "8px",
                                  }}
                                  onClick={() => handleEditarBien(bien)}
                                />
                                <img
                                  src={drop}
                                  alt="Eliminar"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleEliminarBien(bien.bienId)}
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
