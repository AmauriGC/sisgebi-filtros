import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./assets/css/Login.css";
import logo from "./assets/img/sisgebi.jpeg";
import roles from "./assets/img/account-tie.svg";
import roles2 from "./assets/img/account-badge.svg";
import roles3 from "./assets/img/account.svg";

const Login = () => {
  const [rol, setRol] = useState("");
  const navigate = useNavigate();

  const colores = {
    Administrador: {
      fondo: "#A7D0D2",
      texto: "white",
      btnFondo: "#FFFFFF",
      btnTexto: "#254B5E",
    },
    Responsable: {
      fondo: "#F1E6D2",
      texto: "#254B5E",
      btnFondo: "#FFFFFF",
      btnTexto: "#254B5E",
    },
    Becario: {
      fondo: "#546EAB",
      texto: "white",
      btnFondo: "#FFFFFF",
      btnTexto: "#254B5E",
    },
    "": {
      fondo: "white",
      texto: "black",
      btnFondo: "#4697B4",
      btnTexto: "white",
    },
  };

  const imagenRol = {
    Administrador: roles,
    Responsable: roles2,
    Becario: roles3,
    "": "",
  };

  return (
    <motion.div
      className="d-flex min-vh-100 align-items-center justify-content-center"
      style={{ background: "linear-gradient(135deg, #254b5e, #546eab, #4697b4, #a7d0d2)", gap: "100px" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sección izquierda (iconos que cambian según el rol) */}
      <motion.div
        className="d-flex flex-column align-items-center col-6 col-sm-6 col-md-4 col-lg-4"
        style={{ alignSelf: "flex-start" }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="p-5 shadow text-center d-flex flex-column"
          style={{
            width: "420px",
            height: "580px",
            borderRadius: "0 0 15px 15px",
            backgroundColor: colores[rol].fondo,
            color: colores[rol].texto,
          }}
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          <div className="mx-auto" style={{ width: "120px", height: "120px" }}>
            {/* Imagen que cambia según el rol */}
            <AnimatePresence mode="wait">
              <motion.img
                key={rol}
                src={imagenRol[rol]}
                className="img-fluid"
                style={{
                  maxHeight: "240px",
                  maxWidth: "240px",
                  backgroundColor: rol === "" ? "white" : "white",
                  borderRadius: "50%",
                  padding: rol === "" ? "0" : "10px",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
              />
            </AnimatePresence>
          </div>

          {/* Cambia dinámicamente el texto */}
          <motion.p
            className="fw-bold fs-3 mt-3"
            key={rol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {rol || "Seleciona un rol"}
          </motion.p>

          {/* Botones abajo */}
          <div className="mt-auto d-flex flex-row gap-3 justify-content-center">
            <motion.button
              className="btn w-50 fw-bold"
              style={{
                backgroundColor: colores[rol].btnFondo,
                color: colores[rol].btnTexto,
                height: "60px",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/forgot")}
            >
              Olvidé mis datos
            </motion.button>
            <motion.button
              className="btn w-50 fw-bold"
              style={{
                backgroundColor: colores[rol].btnFondo,
                color: colores[rol].btnTexto,
              }}
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/form")}
            >
              Iniciar sesión
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Sección derecha (logo y selección de rol) */}
      <motion.div
        className="d-flex flex-column align-items-center col-6 col-sm-6 col-md-4 col-lg-4"
        style={{ alignSelf: "flex-end" }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="bg-white p-5 shadow text-center"
          style={{
            width: "420px",
            height: "580px",
            borderRadius: "15px 15px 0 0",
          }}
          initial={{ scale: 0.8, rotate: 5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          <motion.div
            className="d-flex justify-content-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <img
              src={logo}
              alt="LOGO"
              className="img-fluid p-3"
              style={{ maxHeight: "150px", maxWidth: "150px", borderRadius: "50%" }}
            />
          </motion.div>

          <motion.p
            className="fs-5 mt-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Bienvenido a
          </motion.p>
          <motion.p
            className="fw-bold fs-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            SISGEBI
          </motion.p>
          <div className="mt-4 d-flex flex-column gap-3 align-items-center">
            {/* Al hacer clic en un botón, cambia el rol y el color de la tarjeta izquierda */}
            <motion.button
              className="btn w-100 text-center p-4 shadow-sm"
              style={{
                backgroundColor: "#A7D0D2",
                color: "#254B5E",
                borderRadius: "10px",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRol("Administrador")}
            >
              Administrador
            </motion.button>
            <motion.button
              className="btn w-100 text-center p-4 shadow-sm"
              style={{
                backgroundColor: "#F1E6D2",
                color: "#254B5E",
                borderRadius: "10px",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRol("Responsable")}
            >
              Responsable
            </motion.button>
            <motion.button
              className="btn w-100 text-center p-4 shadow-sm"
              style={{
                backgroundColor: "#546EAB",
                color: "#F1E6D2",
                borderRadius: "10px",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRol("Becario")}
            >
              Becario
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
