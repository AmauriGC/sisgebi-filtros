import * as React from "react";
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
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const navigate = useNavigate();

  const [bienSeleccionado, setBienSeleccionado] = React.useState(null);
  const [motivoEliminar, setMotivoEliminar] = React.useState("");

  const [openModalActualizar, setopenModalActualizar] = React.useState(false);
  const [openModalEliminar, setOpenModalEliminar] = React.useState(false);
  const [openModalCrear, setOpenModalCrear] = React.useState(false);

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
        setBienes([...bienes, response.data]);
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
        window.location.reload();
      })
      .catch((error) => {
        console.error("Hubo un error al crear el bien:", error.response?.data || error.message);
      });
  };

  const handleEditarBien = (bien) => {
    setBienSeleccionado(bien);
    setopenModalActualizar(true);
  };

  const handleActualizar = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !bienSeleccionado) return;

    axios
      .put(`http://localhost:8080/api/bienes/${bienSeleccionado.idBien}`, bienSeleccionado, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBienes(bienes.map((bien) => (bien.idBien === bienSeleccionado.idBien ? response.data : bien)));
        setopenModalActualizar(false);
      })
      .catch((error) => {
        console.error("Hubo un error al actualizar el bien:", error);
      });
    // window.location.reload();
  };

  const handleEliminarBien = (idBien) => {
    const bien = bienes.find((bien) => bien.idBien === idBien);
    setBienSeleccionado(bien);
    setOpenModalEliminar(true);
  };

  const confirmarEliminar = () => {
    const token = sessionStorage.getItem("token");
    if (!token || !bienSeleccionado) return;

    axios
      .delete(`http://localhost:8080/api/bienes/${bienSeleccionado.idBien}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { motivo: motivoEliminar },
      })
      .then(() => {
        setBienes(bienes.filter((bien) => bien.idBien !== bienSeleccionado.idBien));
        setOpenModalEliminar(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error al eliminar el bien:", error);
      });
    window.location.reload();
  };

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
    { id: "tipoBien", label: "Tipo", minWidth: 80 },
    { id: "marca", label: "Marca", minWidth: 80 },
    { id: "modelo", label: "Modelo", minWidth: 80 },
    { id: "areaComun", label: "Área Común", minWidth: 100 },
    { id: "disponibilidad", label: "Disponibilidad", minWidth: 60 },
    { id: "status", label: "Estado", minWidth: 60 },
    { id: "crear", label: "Crear", minWidth: 50 },
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

  return (
    <div style={{ display: "flex", backgroundColor: "#F0F0F0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Modal para crear */}
      <Modal
        open={openModalCrear}
        onClose={() => setOpenModalCrear(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear Bien
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
                  <label>Código:</label>
                  <input
                    type="text"
                    value={nuevoBien.codigo}
                    onChange={(e) => setNuevoBien({ ...nuevoBien, codigo: e.target.value })}
                    required
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Número de Serie:</label>
                  <input
                    type="text"
                    value={nuevoBien.numeroSerie}
                    onChange={(e) => setNuevoBien({ ...nuevoBien, numeroSerie: e.target.value })}
                    required
                    style={{ width: "100%" }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label>Marca:</label>
                  <Select
                    options={marcaOptions}
                    value={nuevoBien.marca}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, marca: selected })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>

              {/* Segunda fila: Modelo, Tipo de Bien, Área Común */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Modelo:</label>
                  <Select
                    options={modeloOptions}
                    value={nuevoBien.modelo}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, modelo: selected })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Tipo de Bien:</label>
                  <Select
                    options={tipoBienOptions}
                    value={nuevoBien.tipoBien}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, tipoBien: selected })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Área Común:</label>
                  <Select
                    options={areaComunOptions}
                    value={nuevoBien.areaComun}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, areaComun: selected })}
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>

              {/* Tercera fila: Estado, Disponibilidad */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Estado:</label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === nuevoBien.status)}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, status: selected.value })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Disponibilidad:</label>
                  <Select
                    options={disponibilidadOptions}
                    value={disponibilidadOptions.find((option) => option.value === nuevoBien.disponibilidad)}
                    onChange={(selected) => setNuevoBien({ ...nuevoBien, disponibilidad: selected.value })}
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>

              {/* Cuarta fila: Botón de Crear */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Editar Bien
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
                  <label>Código:</label>
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
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Número de Serie:</label>
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
                    style={{ width: "100%" }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label>Marca:</label>
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
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>

              {/* Segunda fila: Modelo, Tipo de Bien, Área Común */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Modelo:</label>
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
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Tipo de Bien:</label>
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
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Área Común:</label>
                  <Select
                    options={areaComunOptions}
                    value={areaComunOptions.find((option) => option.value === bienSeleccionado?.areaComun?.areaId)}
                    onChange={(selected) =>
                      setBienSeleccionado({
                        ...bienSeleccionado,
                        areaComun: { areaId: selected.value },
                      })
                    }
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>

              {/* Tercera fila: Estado, Disponibilidad */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>Estado:</label>
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
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Disponibilidad:</label>
                  <Select
                    options={disponibilidadOptions}
                    value={disponibilidadOptions.find((option) => option.value === bienSeleccionado?.disponibilidad)}
                    onChange={(selected) =>
                      setBienSeleccionado({
                        ...bienSeleccionado,
                        disponibilidad: selected.value,
                      })
                    }
                    required
                    styles={{ control: (base) => ({ ...base, width: "100%" }) }}
                  />
                </div>
              </div>

              {/* Cuarta fila: Botón de Guardar cambios */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
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
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminar Bien
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar este bien?
            <br />
            <label>Motivo de eliminación:</label>
            <input type="text" value={motivoEliminar} onChange={(e) => setMotivoEliminar(e.target.value)} required />
            <button onClick={confirmarEliminar}>Confirmar</button>
            <button onClick={() => setOpenModalEliminar(false)}>Cancelar</button>
          </Typography>
        </Box>
      </Modal>

      <Sidebar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
        <Paper className="col-md-12 col-lg-12 col-xl-12" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB" }}>
            <h3>Bienes existentes</h3>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>
              <button onClick={resetearFiltros} style={{ ...buttonStyle, backgroundColor: "#546EAB" }}>
                Borrar
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Primera fila de filtros */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
                className="col-sm-12 col-md-12 col-lg-12 col-xl-12"
              >
                <Select
                  placeholder="Tipo"
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
                <Select
                  placeholder="Modelo"
                  value={filtroModelo}
                  onChange={setFiltroModelo}
                  options={modeloOptions}
                  styles={customSelectStyles}
                />
              </div>

              {/* Segunda fila de filtros */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px", // Espacio entre elementos
                  justifyContent: "center",
                }}
              >
                <Select
                  placeholder="Área"
                  value={filtroAreaComun}
                  onChange={setFiltroAreaComun}
                  options={areaComunOptions}
                  styles={customSelectStyles}
                />
                <Select
                  placeholder="Estado"
                  value={filtroStatus}
                  onChange={setFiltroStatus}
                  options={statusOptions}
                  styles={customSelectStyles}
                />
                <Select
                  placeholder="Disponibilidad"
                  value={filtroDisponibilidad}
                  onChange={setFiltroDisponibilidad}
                  options={disponibilidadOptions}
                  styles={customSelectStyles}
                />
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
                      {column.id === "crear" ? (
                        <button
                          onClick={() => setOpenModalCrear(true)}
                          style={{
                            backgroundColor: "#254B5E",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "13px",
                            width: "100%",
                            padding: "4px",
                          }}
                        >
                          Crear
                        </button>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bienes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bien) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={bien.idBien}>
                      {columns.map((column) => {
                        if (column.id === "crear") {
                          return (
                            <TableCell key={column.id} align={column.align}>
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
          />
        </Paper>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#254B5E",
  padding: "5px",
  border: "none",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "14px",
  cursor: "pointer",
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

export default Bienes;
