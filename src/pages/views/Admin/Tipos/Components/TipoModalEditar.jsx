import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Select from "react-select";

export default function TipoModalEditar({
  openModalEditar,
  setOpenModalEditar,
  tipoBienSeleccionado,
  setTipoBienSeleccionado,
  statusOptions,
  handleActualizarTipoBien,
}) {
  return (
    <div>
      <Modal
        open={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            <strong>Editar Tipo de Bien</strong>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleActualizarTipoBien();
              }}
            >
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Nombre del Tipo de Bien:</strong>
                  </label>
                  <input
                    type="text"
                    value={tipoBienSeleccionado?.nombreTipoBien || ""}
                    onChange={(e) =>
                      setTipoBienSeleccionado({
                        ...tipoBienSeleccionado,
                        nombreTipoBien: e.target.value,
                      })
                    }
                    required
                    style={{ width: "100%", height: "40px", border: "solid 1px #c2c2c2", borderRadius: "5px" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label>
                    <strong>Estado:</strong>
                  </label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find((option) => option.value === tipoBienSeleccionado?.status)}
                    onChange={(selected) =>
                      setTipoBienSeleccionado({
                        ...tipoBienSeleccionado,
                        status: selected.value,
                      })
                    }
                    required
                    styles={SelectOptionsStyles}
                  />
                </div>
              </div>
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
            </form>
          </Typography>
        </Box>
      </Modal>
    </div>
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
