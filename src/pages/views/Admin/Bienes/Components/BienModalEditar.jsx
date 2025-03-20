import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar Framer Motion
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "react-select";

export default function BienModalEditar({
  openModalEditar,
  setOpenModalEditar,
  bienSeleccionado,
  setBienSeleccionado,
  tipoBienOptions,
  marcaOptions,
  modeloOptions,
  areaComunOptions,
  statusOptions,
  handleActualizar,
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
                <strong>Editar Bien</strong>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleActualizar();
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
                          value={tipoBienOptions.find(
                            (option) => option.value === bienSeleccionado?.tipoBien?.tipoBienId
                          )}
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
                          value={areaComunOptions.find(
                            (option) => option.value === bienSeleccionado?.areaComun?.areaId
                          )}
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
                  </motion.div>

                  {/* Animación para el cuarto grupo de inputs */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
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
                  </motion.div>

                  {/* Animación para los botones */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
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
