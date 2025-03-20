import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar Framer Motion
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function BienModalEliminar({
  openModalEliminar,
  setOpenModalEliminar,
  confirmarEliminar,
  motivoEliminar,
  setMotivoEliminar,
}) {
  return (
    <AnimatePresence>
      {openModalEliminar && (
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
            <motion.div
              initial={{ opacity: 0, y: -50 }} // Animación inicial: invisible y desplazado hacia arriba
              animate={{ opacity: 1, y: 0 }} // Animación al abrir: visible y en su posición
              transition={{ duration: 0.3, ease: "easeInOut" }} // Duración y tipo de animación
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Eliminar Bien
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                ¿Estás seguro de que deseas eliminar este bien?
              </Typography>
              <Box sx={{ mt: 2 }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
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
                </motion.div>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
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
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
}
