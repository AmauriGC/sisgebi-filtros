import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Importar Framer Motion
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "react-select";

export default function UsuarioModalCrear({
  openModalCrear,
  setOpenModalCrear,
  nuevoUsuario,
  setNuevoUsuario,
  rolOptions,
  handleCrearUsuario,
  isFormValid,
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
                <strong>Registrar usuario</strong>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCrearUsuario();
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
                          <strong>Nombre:</strong>
                        </label>
                        <input
                          type="text"
                          placeholder="Nombre"
                          value={nuevoUsuario.nombres}
                          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombres: e.target.value })}
                          required
                          style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Apellidos:</strong>
                        </label>
                        <input
                          type="text"
                          placeholder="Apellidos"
                          value={nuevoUsuario.apellidos}
                          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellidos: e.target.value })}
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
                          <strong>Correo:</strong>
                        </label>
                        <input
                          type="email"
                          placeholder="Correo"
                          value={nuevoUsuario.correo}
                          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
                          required
                          style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Contraseña:</strong>
                        </label>
                        <input
                          type="password"
                          placeholder="Contraseña"
                          value={nuevoUsuario.contrasena}
                          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })}
                          required
                          style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
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
                          <strong>Rol:</strong>
                        </label>
                        <Select
                          options={rolOptions}
                          placeholder="Seleccione un rol"
                          value={rolOptions.find((option) => option.value === nuevoUsuario.rol)}
                          onChange={(selected) => setNuevoUsuario({ ...nuevoUsuario, rol: selected.value })}
                          required
                          styles={SelectOptionsStyles}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>
                          <strong>Lugar:</strong>
                        </label>
                        <input
                          type="text"
                          placeholder="Lugar"
                          value={nuevoUsuario.lugar}
                          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, lugar: e.target.value })}
                          required
                          style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
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
                        type="button"
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
                          backgroundColor: isFormValid() ? "#254B5E" : "#b7b7b7",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: isFormValid() ? "pointer" : "not-allowed",
                        }}
                        disabled={!isFormValid()}
                      >
                        Registrar
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
