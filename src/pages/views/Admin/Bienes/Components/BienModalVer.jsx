import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Barcode from "react-barcode";

export default function BienModalVer({ openModalVer, setOpenModalVer, bienSeleccionado }) {
  const [openBarcodeModal, setOpenBarcodeModal] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");

  // Función para generar el valor del código de barras
  const getBarcodeValue = () => {
    if (!bienSeleccionado) return "";
    return bienSeleccionado.codigo || `BIEN-${bienSeleccionado.bienId}`;
  };

  const handleBarcodeClick = () => {
    setBarcodeValue(getBarcodeValue());
    setOpenBarcodeModal(true);
  };

  return (
    <>
      <AnimatePresence>
        {openModalVer && (
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
                width: 800, // Aumentamos el ancho para acomodar las dos columnas
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: "10px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: "bold", color: "#254B5E" }}
                >
                  Detalles del Bien
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: "20px",
                    mt: 2,
                    flexDirection: { xs: "column", md: "row" }, // Responsive: columna en móvil, fila en desktop
                  }}
                >
                  {/* Columna izquierda - Datos del bien */}
                  <Box
                    sx={{
                      flex: 1,
                      backgroundColor: "#f9f9f9",
                      p: 3,
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    {[
                      { label: "Código:", value: bienSeleccionado?.codigo },
                      { label: "Número de Serie:", value: bienSeleccionado?.numeroSerie },
                      { label: "Usuario:", value: bienSeleccionado?.usuario?.nombres },
                      { label: "Marca:", value: bienSeleccionado?.marca?.nombreMarca },
                      { label: "Modelo:", value: bienSeleccionado?.modelo?.nombreModelo },
                      { label: "Tipo de Bien:", value: bienSeleccionado?.tipoBien?.nombreTipoBien },
                      { label: "Área Común:", value: bienSeleccionado?.areaComun?.nombreArea },
                      { label: "Disponibilidad:", value: bienSeleccionado?.disponibilidad },
                      { label: "Estado:", value: bienSeleccionado?.status },
                      { label: "Motivo de eliminación:", value: bienSeleccionado?.motivo },
                      {
                        label: "Fecha de eliminación:",
                        value: bienSeleccionado?.deleteAt
                          ? new Date(bienSeleccionado?.deleteAt).toLocaleString()
                          : "No ha sido eliminado",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #e0e0e0",
                            pb: 1,
                            mb: 2,
                          }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body1">{item.value || "N/A"}</Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  {/* Columna derecha - Código de barras */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: "300px" }, // Ancho fijo para desktop, 100% en móvil
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                          width: "100%",
                          cursor: "pointer",
                          "&:hover": {
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                        onClick={handleBarcodeClick}
                      >
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
                          Código de Barras
                        </Typography>
                        <Box
                          sx={{
                            p: 1,
                            backgroundColor: "white",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Barcode
                            value={getBarcodeValue()}
                            format="CODE128"
                            width={1.5}
                            height={80}
                            displayValue={false}
                            margin={10}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, fontFamily: "monospace", textAlign: "center" }}>
                          {getBarcodeValue()}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ mt: 1, display: "block", textAlign: "center", color: "#546E7A" }}
                        >
                          (Haz clic para ampliar)
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal para el código de barras en grande */}
      {openBarcodeModal && (
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
          onClick={() => setOpenBarcodeModal(false)}
        >
          <div
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#254B5E" }}>
              Código de Barras
            </Typography>
            <Box
              sx={{
                p: 3,
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <Barcode
                value={barcodeValue}
                format="CODE128"
                width={3}
                height={150}
                displayValue={true}
                margin={20}
                fontSize={16}
              />
            </Box>
            <Typography variant="body1" sx={{ mt: 3, fontFamily: "monospace" }}>
              {barcodeValue}
            </Typography>
            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#254B5E",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => setOpenBarcodeModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
