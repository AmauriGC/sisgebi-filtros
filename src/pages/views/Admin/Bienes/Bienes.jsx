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
import { jwtDecode } from "jwt-decode";

const Bienes = () => {
  const [bienes, setBienes] = React.useState([]);
  const [filtroStatus, setFiltroStatus] = React.useState(null);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = React.useState(null);

  const [filtroAreaComun, setFiltroAreaComun] = React.useState(null);
  const [filtroTipoBien, setFiltroTipoBien] = React.useState(null);
  const [filtroMarca, setFiltroMarca] = React.useState(null);
  const [filtroModelo, setFiltroModelo] = React.useState(null);
  const [filtroUsuario, setFiltroUsuario] = React.useState(null);

  const [areaComunOptions, setAreaComunOptions] = React.useState([]);
  const [tipoBienOptions, setTipoBienOptions] = React.useState([]);
  const [marcaOptions, setMarcaOptions] = React.useState([]);
  const [modeloOptions, setModeloOptions] = React.useState([]);
  const [usuarioOptions, setUsuarioOptions] = React.useState([]);

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

  const statusActivoOptions = [{ value: "ACTIVO", label: "Activo" }];

  const disponibilidadOptions = [
    { value: "DISPONIBLE", label: "Disponible" },
    { value: "OCUPADO", label: "Ocupado" },
  ];

  const columns = [
    { id: "bienId", label: "#", minWidth: 25 },
    { id: "codigo", label: "Código", minWidth: 40 },
    { id: "numeroSerie", label: "No. Serie", minWidth: 40 },
    { id: "id", label: "Responsable", minWidth: 80 },
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
  }, [filtroStatus, filtroDisponibilidad, filtroUsuario, filtroAreaComun, filtroTipoBien, filtroMarca, filtroModelo]);

  const obtenerBienes = () => {
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
      .get("http://localhost:8080/api/bienes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBienes(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar los bienes",
          text: "Hubo un problema al intentar obtener los bienes. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const cargarOpcionesFiltros = () => {
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
      .get("http://localhost:8080/api/areas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const areasActivas = response.data.filter((area) => area.status === "ACTIVO");
        setAreaComunOptions(
          areasActivas.map((area) => ({
            value: area.areaId,
            label: area.nombreArea,
          }))
        );
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar áreas comunes",
          text: "Hubo un problema al intentar cargar las áreas comunes. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });

    axios
      .get("http://localhost:8080/api/tipo-bien", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const tiposActivos = response.data.filter((tipo) => tipo.status === "ACTIVO");
        setTipoBienOptions(
          tiposActivos.map((tipo) => ({
            value: tipo.tipoBienId,
            label: tipo.nombreTipoBien,
          }))
        );
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar tipos de bien",
          text: "Hubo un problema al intentar cargar los tipos de bien. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });

    axios
      .get("http://localhost:8080/api/marca", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const marcasActivas = response.data.filter((marca) => marca.status === "ACTIVO");
        setMarcaOptions(
          marcasActivas.map((marca) => ({
            value: marca.marcaId,
            label: marca.nombreMarca,
          }))
        );
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar marcas",
          text: "Hubo un problema al intentar cargar las marcas. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });

    axios
      .get("http://localhost:8080/api/modelo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const modelosActivos = response.data.filter((modelo) => modelo.status === "ACTIVO");
        setModeloOptions(
          modelosActivos.map((modelo) => ({
            value: modelo.modeloId,
            label: modelo.nombreModelo,
          }))
        );
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar modelos",
          text: "Hubo un problema al intentar cargar los modelos. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });

    axios
      .get("http://localhost:8080/api/usuarios/responsables", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const usuariosActivos = response.data.filter((usuario) => usuario.status === "ACTIVO");
        setUsuarioOptions(
          usuariosActivos.map((usuario) => ({
            value: usuario.id,
            label: usuario.nombres,
          }))
        );
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al cargar los usuarios",
          text: "Hubo un problema al intentar cargar los usuarios. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const aplicarFiltros = () => {
    const params = {};
    if (filtroStatus) params.status = filtroStatus.value;
    if (filtroDisponibilidad) params.disponibilidad = filtroDisponibilidad.value;
    if (filtroUsuario) params.id = filtroUsuario.value;
    if (filtroAreaComun) params.areaId = filtroAreaComun.value;
    if (filtroTipoBien) params.tipoBienId = filtroTipoBien.value;
    if (filtroMarca) params.marcaId = filtroMarca.value;
    if (filtroModelo) params.modeloId = filtroModelo.value;
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
      .get("http://localhost:8080/api/bienes/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      .then((response) => {
        setBienes(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al filtrar los bienes",
          text: "Hubo un problema al intentar filtrar los bienes. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const resetearFiltros = () => {
    setFiltroStatus(null);
    setFiltroDisponibilidad(null);
    setFiltroUsuario(null);
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

    const bienParaEnviar = {
      codigo: nuevoBien.codigo,
      numeroSerie: nuevoBien.numeroSerie,
      usuario: { id: nuevoBien.usuario.value },
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
        // Obtener el ID del nuevo bien creado
        const nuevoBienId = response.data.bienId;

        // Hacer una nueva petición para obtener el bien con relaciones completas
        return axios.get(`http://localhost:8080/api/bienes/${nuevoBienId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((response) => {
        // Ahora response.data contiene el bien con todas las relaciones
        setBienes((prevBienes) => [...prevBienes, response.data]);

        // Resetear formulario y cerrar modal
        setOpenModalCrear(false);
        setNuevoBien({
          codigo: "",
          numeroSerie: "",
          usuario: null,
          tipoBien: null,
          marca: null,
          modelo: null,
          areaComun: null,
          status: "ACTIVO",
          disponibilidad: "DISPONIBLE",
          motivo: "",
        });

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Bien creado correctamente",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.error("Error al crear el bien:", error);

        let errorMessage = "No se pudo crear el bien. Verifica los datos.";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#254B5E",
        });
      });
  };

  const handleEditarBien = (bien) => {
    setBienSeleccionado({
      ...bien,
      motivo: bien.motivo || "",
    });
    setOpenModalEditar(true);
  };

  const handleActualizar = () => {
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

    if (!bienSeleccionado) return;

    const bienParaActualizar = {
      ...bienSeleccionado,
      motivo: bienSeleccionado.motivo || "",
    };

    axios
      .put(`http://localhost:8080/api/bienes/${bienSeleccionado.bienId}`, bienParaActualizar, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBienes(bienes.map((bien) => (bien.bienId === bienSeleccionado.bienId ? response.data : bien)));

        setOpenModalEditar(false);

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Bien actualizado correctamente",
          showConfirmButton: true,
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el bien:", error);
        setOpenModalEditar(false);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se pudo actualizar el bien. Por favor, verifica los datos e inténtalo de nuevo.",
          showConfirmButton: true,
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

    if (!bienSeleccionado || !motivoEliminar) return;

    axios
      .put(
        `http://localhost:8080/api/bienes/${bienSeleccionado.bienId}`,
        { ...bienSeleccionado, status: "INACTIVO", motivo: motivoEliminar },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        const bienActualizado = response.data;
        setBienes(bienes.map((bien) => (bien.bienId === bienActualizado.bienId ? bienActualizado : bien)));

        setOpenModalEliminar(false);

        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El bien ha sido eliminado",
          showConfirmButton: true,
          timer: 3000,
        });
      })
      .catch((error) => {
        console.error("Error al eliminar el bien:", error);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se ha podido eliminar el bien. Por favor, inténtalo de nuevo más tarde.",
          showConfirmButton: true,
        });
      });
  };

  const handleVerBien = (bien) => {
    Swal.fire({
      icon: "info",
      title: "Detalles del Bien",
      text: "Mostrando detalles del bien seleccionado",
      timer: 1000,
      showConfirmButton: false,
    }).then(() => {
      setBienSeleccionado(bien);

      setOpenModalVer(true);
    });
  };

  const isFormValid = () => {
    return (
      nuevoBien.codigo.trim() !== "" &&
      nuevoBien.numeroSerie.trim() !== "" &&
      nuevoBien.tipoBien !== null &&
      nuevoBien.usuario !== null &&
      nuevoBien.marca !== null &&
      nuevoBien.modelo !== null &&
      nuevoBien.areaComun !== null &&
      nuevoBien.status.trim() !== "" &&
      nuevoBien.disponibilidad.trim() !== ""
    );
  };

  const isUpdateFormValid = () => {
    return (
      bienSeleccionado.codigo.trim() !== "" &&
      bienSeleccionado.numeroSerie.trim() !== "" &&
      bienSeleccionado.usuario !== null &&
      bienSeleccionado.tipoBien !== null &&
      bienSeleccionado.marca !== null &&
      bienSeleccionado.modelo !== null &&
      bienSeleccionado.areaComun !== null &&
      bienSeleccionado.status.trim() !== "" &&
      bienSeleccionado.disponibilidad.trim() !== ""
    );
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
        usuarioOptions={usuarioOptions}
        tipoBienOptions={tipoBienOptions}
        marcaOptions={marcaOptions}
        modeloOptions={modeloOptions}
        areaComunOptions={areaComunOptions}
        statusOptions={statusOptions}
        disponibilidadOptions={disponibilidadOptions}
        handleCrear={handleCrear}
        isFormValid={isFormValid}
      />

      {/* Modal para editar bien */}
      <BienModalEditar
        openModalEditar={openModalEditar}
        setOpenModalEditar={setOpenModalEditar}
        bienSeleccionado={bienSeleccionado}
        setBienSeleccionado={setBienSeleccionado}
        usuarioOptions={usuarioOptions}
        tipoBienOptions={tipoBienOptions}
        marcaOptions={marcaOptions}
        modeloOptions={modeloOptions}
        areaComunOptions={areaComunOptions}
        statusActivoOptions={statusActivoOptions}
        disponibilidadOptions={disponibilidadOptions}
        handleActualizar={handleActualizar}
        isUpdateFormValid={isUpdateFormValid}
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
            <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                justifyItems: "center",
              }}
            >
              {/* Fila 1 */}

              <Select
                placeholder="Usuario"
                value={filtroUsuario}
                onChange={setFiltroUsuario}
                options={usuarioOptions}
                styles={customSelectStyles}
              />
              <Select
                placeholder="Área Común"
                value={filtroAreaComun}
                onChange={setFiltroAreaComun}
                options={areaComunOptions}
                styles={customSelectStyles}
              />
              <Select
                placeholder="Tipo de Bien"
                value={filtroTipoBien}
                onChange={setFiltroTipoBien}
                options={tipoBienOptions}
                styles={customSelectStyles}
              />
              <Select
                placeholder="Marca"
                value={filtroMarca}
                onChange={setFiltroMarca}
                options={marcaOptions}
                styles={customSelectStyles}
              />

              {/* Fila 2 */}
              <Select
                placeholder="Modelo"
                value={filtroModelo}
                onChange={setFiltroModelo}
                options={modeloOptions}
                styles={customSelectStyles}
              />
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <button onClick={resetearFiltros} style={{ ...buttonStyle, backgroundColor: "#546EAB" }}>
                Borrar
              </button>
              <button
                onClick={() => setOpenModalCrear(true)}
                style={{
                  backgroundColor: "#254B5E",
                  padding: "8px",
                  border: "none",
                  borderRadius: "5px",
                  color: "#fff",
                  fontSize: "14px",
                  cursor: "pointer",
                  width: "150px",
                }}
              >
                Crear
              </button>
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
                            column.id === "id"
                              ? bien.usuario?.nombres
                              : column.id === "tipoBien"
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
    marginBottom: "10px",
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

export default Bienes;
