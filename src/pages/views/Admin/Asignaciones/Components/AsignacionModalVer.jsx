import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar Framer Motion
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function AsignacionModalVer({ openModalBien, setOpenModalBien, bienSeleccionado }) {
  return (
    <div>
      <Modal
        open={openModalBien}
        onClose={() => setOpenModalBien(false)}
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
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                  Disponibilidad:
                </Typography>
                <Typography variant="body1">{bienSeleccionado?.disponibilidad}</Typography>
              </Box>
            </Box>
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <button
              onClick={() => setOpenModalBien(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#254B5E",
                color: "#ffffff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
