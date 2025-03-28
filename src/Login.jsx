import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import at from "./assets/img/at.svg";
import lock from "./assets/img/lock-outline.svg";
import closeEye from "./assets/img/eye-off-outline.svg";
import eye from "./assets/img/eye-outline.svg";
import logo from "./assets/img/ICON.png";
import roles from "./assets/img/account-tie.svg";
import roles2 from "./assets/img/account-badge.svg";
import roles3 from "./assets/img/account.svg";

export default function Form() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const correoValido = /^[a-zA-Z0-9@._´]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
  const contrasenaValida = /^[a-zA-Z0-9@._´]+$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación del correo
    if (!correoValido.test(correo)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor, ingresa un correo electrónico válido.",
        showConfirmButton: true,
      });
      setIsSubmitting(false);
      return;
    }

    // Validación de la contraseña
    if (!contrasenaValida.test(contrasena)) {
      Swal.fire({
        icon: "error",
        title: "Contraseña inválida",
        text: "La contraseña solo puede contener caracteres alfanuméricos.",
        showConfirmButton: true,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/auth/login?correo=${correo}&contrasena=${contrasena}`);

      const { token, rol } = response.data;
      sessionStorage.setItem("token", token);

      // Mostrar alerta de éxito antes de redirigir
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Redirigir según el rol
        if (rol === "ADMINISTRADOR") {
          navigate("/admin-dashboard");
        } else if (rol === "BECARIO") {
          navigate("/becario-dashboard");
        } else if (rol === "RESPONSABLE") {
          navigate("/responsable-dashboard");
        }
      });
    } catch (err) {
      // Mostrar alerta de error si las credenciales son incorrectas
      Swal.fire({
        icon: "error",
        title: "Error de autenticación",
        text: "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.",
        showConfirmButton: true,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="d-flex min-vh-100 align-items-center justify-content-center"
      style={{ 
        background: "linear-gradient(135deg, #254b5e, #546eab, #4697b4, #a7d0d2)",
        padding: "20px"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="container"
        style={{
          width: "100%",
          maxWidth: "1000px",
          backgroundColor: colores[rol].fondo,
          borderRadius: "15px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          display: "flex",
          overflow: "hidden",
          color: colores[rol].texto,
        }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Sección izquierda - Imagen del rol */}
        <motion.div
          className="d-flex flex-column align-items-center justify-content-center p-5"
          style={{
            width: "40%",
            minHeight: "600px",
            backgroundColor: colores[rol].fondo,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={rol}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {rol && (
                <>
                  <motion.img
                    src={imagenRol[rol]}
                    className="img-fluid mb-4"
                    style={{
                      width: "200px",
                      height: "200px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "20px",
                      objectFit: "contain",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200,
                      damping: 15
                    }}
                  />
                  <motion.h2
                    className="fw-bold mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {rol}
                  </motion.h2>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Sección derecha - Formulario */}
        <motion.div
          className="p-5"
          style={{
            width: "60%",
            backgroundColor: "white",
            color: "#254B5E",
          }}
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div className="d-flex align-items-center">
              <motion.img
                src={logo}
                alt="LOGO"
                className="img-fluid"
                style={{
                  width: "60px",
                  height: "60px",
                  marginRight: "20px",
                }}
                whileHover={{ rotate: 5 }}
              />
              <Link to="/">
                <motion.button
                  type="button"
                  className="btn btn-link"
                  style={{
                    color: "#254B5E",
                    textDecoration: "none",
                    fontSize: "18px",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Regresar
                </motion.button>
              </Link>
            </div>
            <h3 className="mb-0">Iniciar sesión</h3>
          </div>

          {/* Selector de rol con animaciones */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h5 className="mb-3">Selecciona tu rol:</h5>
            <div className="d-flex flex-column gap-3">
              <motion.button
                className="btn w-100 text-center p-3 shadow-sm"
                style={{
                  backgroundColor: "#A7D0D2",
                  color: "#254B5E",
                  borderRadius: "10px",
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRol("Administrador")}
              >
                Administrador
              </motion.button>
              <motion.button
                className="btn w-100 text-center p-3 shadow-sm"
                style={{
                  backgroundColor: "#F1E6D2",
                  color: "#254B5E",
                  borderRadius: "10px",
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRol("Responsable")}
              >
                Responsable
              </motion.button>
              <motion.button
                className="btn w-100 text-center p-3 shadow-sm"
                style={{
                  backgroundColor: "#546EAB",
                  color: "#F1E6D2",
                  borderRadius: "10px",
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRol("Becario")}
              >
                Becario
              </motion.button>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-4">
              <label htmlFor="correo" className="form-label">Correo</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <img src={at} alt="at" width="20" />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0"
                  id="correo"
                  placeholder="Correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="contrasena" className="form-label">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <img src={lock} alt="lock" width="20" />
                </span>
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  className="form-control border-start-0"
                  id="contrasena"
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                />
                <motion.button
                  type="button"
                  className="input-group-text bg-transparent border-start-0"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  whileTap={{ scale: 0.9 }}
                >
                  <img 
                    src={mostrarContrasena ? closeEye : eye} 
                    alt="toggle visibility" 
                    width="20" 
                  />
                </motion.button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              className="btn w-100 py-3 fw-bold mt-3"
              style={{
                backgroundColor: colores[rol].btnFondo,
                color: colores[rol].btnTexto,
                borderRadius: "10px",
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              Ingresar
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}