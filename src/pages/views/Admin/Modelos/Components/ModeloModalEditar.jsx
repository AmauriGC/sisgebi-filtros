import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "react-select";

export default function ModeloModalEditar({
  openModalEditar,
  setOpenModalEditar,
  modeloSeleccionado,
  setModeloSeleccionado,
  statusActivoOptions,
  handleActualizarModelo,
  isUpdateFormValid,
  handleImageChange,
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
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Typography id="modal-modal-title" variant="h4" component="h2">
                <strong>Editar Modelo</strong>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleActualizarModelo();
                  }}
                >
                  {/* Input del nombre del modelo */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Nombre del Modelo:</strong>
                        </label>
                        <input
                          type="text"
                          value={modeloSeleccionado?.nombreModelo || ""}
                          onChange={(e) =>
                            setModeloSeleccionado({
                              ...modeloSeleccionado,
                              nombreModelo: e.target.value,
                            })
                          }
                          required
                          style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Sección de foto con animación mejorada */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 100,
                      damping: 10,
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                        padding: "15px",
                        backgroundColor: "#f8f8f8",
                        borderRadius: "8px",
                        border: "2px dashed #e0e0e0",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Foto del Modelo:</strong>
                        </label>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                              width: "100%",
                              height: "40px",
                              border: "solid 1px #c2c2c2",
                              borderRadius: "5px",
                              padding: "5px",
                              cursor: "pointer",
                            }}
                          />
                        </motion.div>
                        {modeloSeleccionado.foto ? (
                          <p style={{ marginTop: "8px" }}>Nueva imagen seleccionada: {modeloSeleccionado.foto.name}</p>
                        ) : (
                          <p style={{ marginTop: "8px" }}>
                            No se ha seleccionado nueva imagen (se mantendrá la actual)
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Select de estado */}
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
                          options={statusActivoOptions}
                          value={
                            statusActivoOptions.find((option) => option.value === modeloSeleccionado?.status) || {
                              value: modeloSeleccionado?.status,
                              label: modeloSeleccionado?.status,
                            }
                          }
                          onChange={(selected) => {
                            if (selected.value === "ACTIVO") {
                              setModeloSeleccionado({
                                ...modeloSeleccionado,
                                status: selected.value,
                              });
                            }
                          }}
                          required
                          styles={SelectOptionsStyles}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Botones */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "10px" }}>
                      <button
                        type="button"
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
                          backgroundColor: isUpdateFormValid() ? "#254B5E" : "#b7b7b7",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: isUpdateFormValid() ? "pointer" : "not-allowed",
                        }}
                        disabled={!isUpdateFormValid()}
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
