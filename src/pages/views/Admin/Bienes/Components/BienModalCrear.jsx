import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar Framer Motion
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "react-select";

export default function BienModalCrear({
  openModalCrear,
  setOpenModalCrear,
  nuevoBien,
  setNuevoBien,
  tipoBienOptions,
  marcaOptions,
  modeloOptions,
  areaComunOptions,
  handleCrear,
}) {
  return (
    <AnimatePresence>
      {openModalCrear && (
        <Modal
          open={openModalCrear}
          onClose={() => setOpenModalCrear(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "800px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }} // Animación inicial: invisible y desplazado hacia arriba
              animate={{ opacity: 1, y: 0 }} // Animación al abrir: visible y en su posición
              transition={{ duration: 0.3, ease: "easeInOut" }} // Duración y tipo de animación
            >
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
                  {/* Animación para el primer grupo de inputs */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Código:</strong>
                        </label>
                        <input
                          type="text"
                          placeholder="Código"
                          value={nuevoBien.codigo}
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
                  </motion.div>

                  {/* Animación para el segundo grupo de inputs */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Marca:</strong>
                        </label>
                        <Select
                          options={marcaOptions}
                          placeholder="Seleccione la marca"
                          value={marcaOptions.find((option) => option.value === nuevoBien.marca?.value)}
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
                          value={modeloOptions.find((option) => option.value === nuevoBien.modelo?.value)}
                          onChange={(selected) => setNuevoBien({ ...nuevoBien, modelo: selected })}
                          required
                          styles={SelectOptionsStyles}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Animación para el tercer grupo de inputs */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Tipo de Bien:</strong>
                        </label>
                        <Select
                          options={tipoBienOptions}
                          placeholder="Seleccione el tipo de bien"
                          value={tipoBienOptions.find((option) => option.value === nuevoBien.tipoBien?.value)}
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
                          value={areaComunOptions.find((option) => option.value === nuevoBien.areaComun?.value)}
                          onChange={(selected) => setNuevoBien({ ...nuevoBien, areaComun: selected })}
                          styles={SelectOptionsStyles}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Animación para los botones */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
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
