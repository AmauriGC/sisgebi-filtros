import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar Framer Motion
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function BienModalVer({ openModalVer, setOpenModalVer, bienSeleccionado }) {
  return (
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
              width: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "10px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }} // Animación inicial: invisible y desplazado hacia arriba
              animate={{ opacity: 1, y: 0 }} // Animación al abrir: visible y en su posición
              transition={{ duration: 0.5, ease: "easeInOut" }} // Duración y tipo de animación
            >
              <Typography
                id="modal-modal-title"
                variant="h5"
                component="h2"
                sx={{ fontWeight: "bold", color: "#254B5E" }}
              >
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
                    justifyContent: "center",
                  }}
                >
                  {[
                    { label: "Código:", value: bienSeleccionado?.codigo },
                    { label: "Número de Serie:", value: bienSeleccionado?.numeroSerie },
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
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#546E7A" }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body1">{item.value}</Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>

                {/* Botón de Cerrar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  {/* <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
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
                  </Box> */}
                </motion.div>
              </Typography>
            </motion.div>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
}
