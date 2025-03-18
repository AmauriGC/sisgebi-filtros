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
import edit from "../../../assets/img/pencil.svg";
import drop from "../../../assets/img/delete.svg";
import Sidebar from "../../../components/Sidebar";

const Bienes = () => {
  const [bienes, setBienes] = React.useState([]);
  const [filtroStatus, setFiltroStatus] = React.useState(null);
  const [filtroDisponibilidad, setFiltroDisponibilidad] = React.useState(null);
  const [filtroAreaComun, setFiltroAreaComun] = React.useState(null);
  const [filtroTipoBien, setFiltroTipoBien] = React.useState(null);
  const [filtroMarca, setFiltroMarca] = React.useState(null);
  const [filtroModelo, setFiltroModelo] = React.useState(null);

  const [areaComunOptions, setAreaComunOptions] = React.useState([]);
  const [tipoBienOptions, setTipoBienOptions] = React.useState([]);
  const [marcaOptions, setMarcaOptions] = React.useState([]);
  const [modeloOptions, setModeloOptions] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const navigate = useNavigate();

  const [bienSeleccionado, setBienSeleccionado] = React.useState(null);
  const [motivoEliminar, setMotivoEliminar] = React.useState("");

  const [openModalActualizar, setopenModalActualizar] = React.useState(false);
  const [openModalEliminar, setOpenModalEliminar] = React.useState(false);
  const [openModalCrear, setOpenModalCrear] = React.useState(false);
  const [openModalVer, setOpenModalVer] = React.useState(false);

  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [colorAlerta, setColorAlerta] = useState("");

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
  }, [filtroStatus, filtroDisponibilidad, filtroAreaComun, filtroTipoBien, filtroMarca, filtroModelo]);

  const obtenerBienes = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
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
        console.error("Error al obtener los bienes:", error);
      });
  };

  const cargarOpcionesFiltros = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return;
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
    if (filtroAreaComun) params.areaComunId = filtroAreaComun.value;
    if (filtroTipoBien) params.tipoBienId = filtroTipoBien.value;
    if (filtroMarca) params.marcaId = filtroMarca.value;
    if (filtroModelo) params.modeloId = filtroModelo.value;

    const token = sessionStorage.getItem("token");
    if (!token) {
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
    if (!token) return;

    const bienParaEnviar = {
      codigo: nuevoBien.codigo,
      numeroSerie: nuevoBien.numeroSerie,
      tipoBien: { tipoBienId: nuevoBien.tipoBien.value },
      marca: { marcaId: nuevoBien.marca.value },
      modelo: { modeloId: nuevoBien.modelo.value },
      areaComun: nuevoBien.areaComun ? { areaId: nuevoBien.areaComun.value } : null,
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

        // Mostrar mensaje de éxito
        setMensajeAlerta("Bien creado correctamente");
        setColorAlerta("#64C267"); // Color verde para éxito

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Hubo un error al crear el bien:", error.response?.data || error.message);

        // Mostrar mensaje de error
        setMensajeAlerta("No se pudo crear el bien");
        setColorAlerta("#C26464"); // Color rojo para error

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      });
  };

  const handleEditarBien = (bien) => {
    setBienSeleccionado({
      ...bien,
      motivo: bien.motivo || "", // Asegúrate de que 'motivo' tenga un valor predeterminado vacío
    });
    setopenModalActualizar(true);
  };

  const handleActualizar = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !bienSeleccionado) return;

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
        setopenModalActualizar(false);

        // Mostrar mensaje de éxito
        setMensajeAlerta("Bien actualizado correctamente");
        setColorAlerta("#64C267"); // Color verde para éxito

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el bien:", error);

        // Mostrar mensaje de error
        setMensajeAlerta("No se pudo actualizar el bien");
        setColorAlerta("#C26464"); // Color rojo para error

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      });
  };

  const handleEliminarBien = (bienId) => {
    const bien = bienes.find((bien) => bien.bienId === bienId);
    setBienSeleccionado(bien);
    setOpenModalEliminar(true);
  };

  const confirmarEliminar = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !bienSeleccionado || !motivoEliminar) return;

    axios
      .put(
        // Cambia DELETE por PUT para eliminación lógica
        `http://localhost:8080/api/bienes/${bienSeleccionado.bienId}`,
        { ...bienSeleccionado, status: "INACTIVO", motivo: motivoEliminar }, // Envía el motivo y el nuevo estado
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        // Reemplazar el bien en el estado con la nueva versión (INACTIVO)
        const bienActualizado = response.data; // Asegúrate de que el backend devuelva el bien actualizado
        setBienes(bienes.map((bien) => (bien.bienId === bienActualizado.bienId ? bienActualizado : bien)));

        // Cerrar el modal de eliminación
        setOpenModalEliminar(false);

        // Mostrar mensaje de éxito
        setMensajeAlerta("El bien se ha eliminado correctamente");
        setColorAlerta("#64C267"); // Color verde para éxito

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error al eliminar el bien:", error);

        // Mostrar mensaje de error
        setMensajeAlerta("No se ha podido eliminar el bien");
        setColorAlerta("#C26464"); // Color rojo para error

        // Cerrar el modal de alerta después de 2 segundos
        setTimeout(() => {
          setMensajeAlerta("");
        }, 2000);
      });
  };

  const handleVerBien = (bien) => {
    setBienSeleccionado(bien); // Establece el bien seleccionado
    setOpenModalVer(true); // Abre el modal de detalles
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
      {/* Modal para crear */}
      <Modal
        open={openModalCrear}
        onClose={() => setOpenModalCrear(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            <strong>Crear Bien</strong>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCrear();
              }}
            >
              {/* Primera fila: Código, Número de Serie, Marca */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Código:</strong>
                  </label>
                  <input
                    type="text"
                    value={nuevoBien.codigo}
                    placeholder="Código"
                    onChange={(e) => setNuevoBien({ ...nuevoBien, codigo: e.target.value })}
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Número de Serie:</strong>
                  </label>
                  <input
                    type="text"
                    placeholder="Número de Serie"
                    value={nuevoBien.numeroSerie}
                    onChange={(e) => setNuevoBien({ ...nuevoBien, numeroSerie: e.target.value })}
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
              </div>

              {/* Segunda fila: Modelo, Tipo de Bien, Área Común */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Marca:</strong>
                  </label>
                  <Select
                    options={marcaOptions}
                    placeholder="Seleccione la marca"
                    value={nuevoBien.marca}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, marca: selected })}
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Modelo:</strong>
                  </label>
                  <Select
                    options={modeloOptions}
                    placeholder="Seleccione el modelo"
                    value={nuevoBien.modelo}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, modelo: selected })}
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>
              </div>

              {/* Tercera fila: Estado, Disponibilidad */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Tipo de Bien:</strong>
                  </label>
                  <Select
                    options={tipoBienOptions}
                    placeholder="Seleccione el tipo de bien"
                    value={nuevoBien.tipoBien}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, tipoBien: selected })}
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Área Común:</strong>
                  </label>
                  <Select
                    options={areaComunOptions}
                    placeholder="Seleccione el área común"
                    value={nuevoBien.areaComun}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, areaComun: selected })}
                    styles={SelectOptionsStyles}
                  />
                </div>
              </div>

              {/* Botones de Cancelar y Crear */}
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
                  Crear
                </button>
              </div>
            </form>
          </Typography>
        </Box>
      </Modal>

      {/* Modal para editar */}
      <Modal
        open={openModalActualizar}
        onClose={() => setopenModalActualizar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            <strong>Editar Bien</strong>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleActualizar();
              }}
            >
              {/* Primera fila: Código, Número de Serie, Marca */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Código:</strong>
                  </label>
                  <input
                    type="text"
                    value={bienSeleccionado?.codigo || ""}
                    onChange={(e) =>
                      setBienSeleccionado({
                        ...bienSeleccionado,
                        codigo: e.target.value,
                      })
                    }
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Número de Serie:</strong>
                  </label>
                  <input
                    type="text"
                    value={bienSeleccionado?.numeroSerie || ""}
                    onChange={(e) =>
                      setBienSeleccionado({
                        ...bienSeleccionado,
                        numeroSerie: e.target.value,
                      })
                    }
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
              </div>

              {/* Segunda fila: Modelo, Tipo de Bien, Área Común */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Marca:</strong>
                  </label>
                  <Select
                    options={marcaOptions}
                    value={marcaOptions.find((option) => option.value === bienSeleccionado?.marca?.marcaId)}
                    onChange={(selected) =>
                      setBienSeleccionado({
                        ...bienSeleccionado,
                        marca: { marcaId: selected.value },
                      })
                    }
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Modelo:</strong>
                  </label>
                  <Select
                    options={modeloOptions}
                    value={modeloOptions.find((option) => option.value === bienSeleccionado?.modelo?.modeloId)}
                    onChange={(selected) =>
                      setBienSeleccionado({
                        ...bienSeleccionado,
                        modelo: { modeloId: selected.value },
                      })
                    }
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>
              </div>

              {/* Tercera fila: Estado, Disponibilidad */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Tipo de Bien:</strong>
                  </label>
                  <Select
                    options={tipoBienOptions}
                    value={tipoBienOptions.find((option) => option.value === bienSeleccionado?.tipoBien?.tipoBienId)}
                    onChange={(selected) =>
                      setBienSeleccionado({
                        ...bienSeleccionado,
                        tipoBien: { tipoBienId: selected.value },
                      })
                    }
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Área Común:</strong>
                  </label>
                  <Select
                    options={areaComunOptions}
                    value={areaComunOptions.find((option) => option.value === bienSeleccionado?.areaComun?.areaId)}
                    onChange={(selected) =>
                      setBienSeleccionado({
                        ...bienSeleccionado,
                        areaComun: { areaId: selected.value },
                      })
                    }
                    styles={SelectOptionsStyles}
                  />
                </div>
              </div>

              {/* Cuarta fila: */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Estado:</strong>
                  </label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === bienSeleccionado?.status)}
                    onChange={(selected) =>
                      setBienSeleccionado({
                        ...bienSeleccionado,
                        status: selected.value,
                      })
                    }
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>
              </div>

              {/* Botones de Cancelar y Guardar cambios */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                <button
                  onClick={() => setopenModalActualizar(false)}
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

      {/* Modal para eliminar */}
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
            Eliminar Bien
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar este bien?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <label>
              <strong>Motivo de eliminación:</strong>
            </label>
            <input
              type="text"
              value={motivoEliminar}
              onChange={(e) => setMotivoEliminar(e.target.value)}
              required
              style={{
                width: "100%",
                height: "40px",
                border: "solid 1px #c2c2c2",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />
          </Box>
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
              onClick={confirmarEliminar}
              style={{
                padding: "10px 20px",
                backgroundColor: "#254B5E",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Confirmar
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
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                onClick={() => setOpenModalVer(false)}
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
                Cerrar
              </button>
            </Box>
          </Typography>
        </Box>
      </Modal>

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
