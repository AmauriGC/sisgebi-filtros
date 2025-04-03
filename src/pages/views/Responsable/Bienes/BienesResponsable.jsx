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
import ver from "../../../../assets/img/eye-outline.svg";
import SidebarResponsable from "../../../../components/SidebarResponsable";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Barcode from "react-barcode";

const BienesResponsable = () => {
  const [bienes, setBienes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bienSeleccionado, setBienSeleccionado] = useState(null);
  const [openModalVer, setOpenModalVer] = useState(false);
  const [id, setUserId] = useState(null);
  const navigate = useNavigate();

  const [filtroAreaComun, setFiltroAreaComun] = React.useState(null);
  const [filtroTipoBien, setFiltroTipoBien] = React.useState(null);
  const [filtroMarca, setFiltroMarca] = React.useState(null);
  const [filtroModelo, setFiltroModelo] = React.useState(null);

  const [areaComunOptions, setAreaComunOptions] = React.useState([]);
  const [tipoBienOptions, setTipoBienOptions] = React.useState([]);
  const [marcaOptions, setMarcaOptions] = React.useState([]);
  const [modeloOptions, setModeloOptions] = React.useState([]);

  const handleDescargarPDF = async () => {
    if (bienes.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No hay bienes para exportar",
        text: "No tienes bienes asignados para generar el reporte.",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Crear el documento PDF
    const doc = new jsPDF();

    // Configuración inicial
    doc.setFont("helvetica", "normal");
    doc.setTextColor(37, 75, 94); // Color #254B5E

    // Encabezado del reporte
    doc.setFontSize(20);
    doc.text("Reporte de Bienes Asignados", 105, 15, { align: "center" });

    // Información del usuario responsable
    const token = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    doc.setFontSize(12);
    doc.text(`Responsable: ${decodedToken.nombres} ${decodedToken.apellidos}`, 14, 25);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

    // Configurar columnas de la tabla
    const columnas = [
      { header: "ID", dataKey: "bienId", cellWidth: 10 },
      { header: "Código", dataKey: "codigo", cellWidth: 25 },
      { header: "No. Serie", dataKey: "numeroSerie", cellWidth: 25 },
      { header: "Tipo", dataKey: "tipo", cellWidth: 25 },
      { header: "Area Comun", dataKey: "areaComun", cellWidth: 25 },
      { header: "Modelo", dataKey: "modelo", cellWidth: 25 },
      { header: "Marca", dataKey: "marca", cellWidth: 25 },
      { header: "Estado", dataKey: "status", cellWidth: 20 },
      { header: "Disponibilidad", dataKey: "disponibilidad", cellWidth: 20 },
    ];

    // Preparar datos para la tabla
    const datos = bienes.map((bien) => ({
      bienId: bien.bienId,
      codigo: bien.codigo || "N/A",
      numeroSerie: bien.numeroSerie || "N/A",
      tipo: bien.tipoBien?.nombreTipoBien || "N/A",
      areaComun: bien.areaComun?.nombreArea || "N/A",
      modelo: bien.modelo?.nombreModelo || "N/A",
      marca: bien.marca?.nombreMarca || "N/A",
      status: bien.status === "ACTIVO" ? "Activo" : "Inactivo",
      disponibilidad: bien.disponibilidad === "DISPONIBLE" ? "Disponible" : "No disponible",
    }));

    // Agregar tabla al PDF
    autoTable(doc, {
      columns: columnas,
      body: datos,
      startY: 40,
      margin: { horizontal: 10 },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
        textColor: [51, 51, 51],
      },
      headerStyles: {
        fillColor: [37, 75, 94],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [241, 230, 210],
      },
      didDrawPage: (data) => {
        // Pie de página
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Página ${data.pageNumber}`,
          doc.internal.pageSize.getWidth() - 15,
          doc.internal.pageSize.getHeight() - 5
        );
      },
    });

    // Crear una página adicional con los códigos de barras
    doc.addPage();

    // Título de la sección de códigos de barras
    doc.setFontSize(16);
    doc.text("Códigos de Barras de Bienes", 105, 20, { align: "center" });

    let yPosition = 30; // Posición vertical inicial

    // Guardar PDF
    doc.save(`bienes_asignados_${decodedToken.nombres}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const columns = [
    { id: "numero", label: "#", minWidth: 25 },
    { id: "codigo", label: "Código", minWidth: 40 },
    { id: "numeroSerie", label: "No. Serie", minWidth: 40 },
    { id: "disponibilidad", label: "Disponibilidad", minWidth: 60 },
    { id: "status", label: "Estado", minWidth: 60 },
    { id: "acciones", label: "Acciones", minWidth: 50 },
  ];

  // Cargar los bienes al montar el componente
  React.useEffect(() => {
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

    if (role !== "RESPONSABLE") {
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

    setUserId(decodedToken.id);

    // Obtenemos todos los bienes y filtramos por el ID del usuario del token
    axios
      .get("http://localhost:8080/api/bienes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Filtramos los bienes asignados al usuario actual
        const bienesAsignados = response.data.filter((bien) => bien.usuario && bien.usuario.id === decodedToken.id);

        setBienes(bienesAsignados);
      })
      .catch((error) => {
        console.error("Error al obtener los bienes:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar tus bienes asignados.",
          showConfirmButton: false,
          timer: 3000,
        });
      });

    cargarOpcionesFiltros();
  }, [navigate]);

  React.useEffect(() => {
    aplicarFiltros();
  }, [filtroAreaComun, filtroTipoBien, filtroMarca, filtroModelo]);

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

    if (role !== "RESPONSABLE") {
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
  };

  // Aplicar filtros adicionales si es necesario
  const aplicarFiltros = () => {
    const params = {};
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

    if (role !== "RESPONSABLE") {
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
        // Filtramos por el ID del usuario directamente
        const bienesFiltrados = response.data.filter((bien) => bien.usuario && bien.usuario.id === decodedToken.id);

        setBienes(bienesFiltrados);
      })
      .catch((error) => {
        console.error("Error al filtrar los bienes:", error);
      });
  };

  const resetearFiltros = () => {
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

  // Obtener los bienes con disponibilidad "DISPONIBLE" y estado "ACTIVO"
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

    if (role !== "RESPONSABLE") {
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
            </Box>

            {/* Botón de Cerrar */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "20px" }}>
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

      <SidebarResponsable />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}>
        <Paper className="col-md-9 col-lg-9 col-xl-9" style={{ height: "fit-content" }}>
          {/* Título y filtros */}
          <Box sx={{ padding: "20px", borderBottom: "2px solid #546EAB", textAlign: "start" }}>
            <h3>Mis bienes asignados</h3>

            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Filtros</p>
                <button
                  onClick={resetearFiltros}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#546EAB",
                    minWidth: "100px",
                  }}
                >
                  Borrar
                </button>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {/* <p style={{ color: "#546EAB", fontSize: "20px", marginBottom: "10px" }}>Descargar mis bienes asignados</p> */}
                <button
                  onClick={handleDescargarPDF}
                  disabled={bienes.length === 0}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#546EAB",
                    minWidth: "220px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <i className="fas fa-file-pdf" style={{ fontSize: "16px" }}></i>
                  Descargar mis bienes asignados
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              {/* Contenedor de los selects (izquierda) */}
              <div style={{ display: "flex", gap: "10px" }}>
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
                <Select
                  placeholder="Modelo"
                  value={filtroModelo}
                  onChange={setFiltroModelo}
                  options={modeloOptions}
                  styles={customSelectStyles}
                />
              </div>
            </div>
            {/* Botón (derecha) */}
            <div style={{ marginLeft: "auto" }}></div>
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
                {bienes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bien, index) => {
                  const numeroFila = page * rowsPerPage + index + 1; // Calculamos el número de fila
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
                        } else if (column.id === "numero") {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ fontSize: "12px", textAlign: "start" }}
                            >
                              {numeroFila}
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

export default BienesResponsable;
