import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar Framer Motion
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "react-select";

export default function AreaModalEditar({
  openModalEditar,
  setOpenModalEditar,
  areaSeleccionada,
  setAreaSeleccionada,
  statusOptions,
  handleActualizarArea,
}) {
  return (
    <AnimatePresence>
      {openModalEditar && (
        <Modal
          open={openModalEditar}
          onClose={() => setOpenModalEditar(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <motion.div
              initial={{ opacity: 0, y: -50 }} // Animación inicial: invisible y desplazado hacia arriba
              animate={{ opacity: 1, y: 0 }} // Animación al abrir: visible y en su posición
              transition={{ duration: 0.3, ease: "easeInOut" }} // Duración y tipo de animación
            >
              <Typography id="modal-modal-title" variant="h4" component="h2">
                <strong>Editar Área</strong>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleActualizarArea();
                  }}
                >
                  {/* Animación para el input del nombre del área */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Nombre del Área:</strong>
                        </label>
                        <input
                          type="text"
                          value={areaSeleccionada?.nombreArea || ""}
                          onChange={(e) =>
                            setAreaSeleccionada({
                              ...areaSeleccionada,
                              nombreArea: e.target.value,
                            })
                          }
                          required
                          style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Animación para el select de estado */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Estado:</strong>
                        </label>
                        <Select
                          options={statusOptions}
                          value={statusOptions.find((option) => option.value === areaSeleccionada?.status)}
                          onChange={(selected) =>
                            setAreaSeleccionada({
                              ...areaSeleccionada,
                              status: selected.value,
                            })
                          }
                          required
                          styles={SelectOptionsStyles}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Animación para los botones */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                      <button
                        onClick={() => setOpenModalEditar(false)}
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
                  </motion.div>
                </form>
              </Typography>
            </motion.div>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
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
