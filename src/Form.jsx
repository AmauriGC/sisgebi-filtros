import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2"; // Importar SweetAlert2
import at from "./assets/img/at.svg";
import lock from "./assets/img/lock-outline.svg";
import closeEye from "./assets/img/eye-off-outline.svg";
import eye from "./assets/img/eye-outline.svg";
import logo from "./assets/img/ICON.png";

export default function Form() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();

  const correoValido = /^[a-zA-Z0-9@._´]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
  const contrasenaValida = /^[a-zA-Z0-9@._´]+$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validación del correo
    if (!correoValido.test(correo)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor, ingresa un correo electrónico válido.",
        showConfirmButton: true,
      });
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
        // text: `Bienvenido, ${rol.toLowerCase()}.`,
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
    }
  };

  return (
    <motion.div
      className="d-flex min-vh-100 align-items-center justify-content-center"
      style={{ background: "linear-gradient(135deg, #254b5e, #546eab, #4697b4, #a7d0d2)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="container"
        style={{
          width: "500px",
          height: "500px",
          backgroundColor: "#F1E6D2",
          borderRadius: "15px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        {/* Encabezado */}
        <motion.div
          style={{
            backgroundColor: "#A7D0D2",
            height: "200px",
            width: "500px",
            borderRadius: "15px 15px 0 0",
            padding: "40px",
          }}
          className="d-flex justify-content-between align-items-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Izquierda: Imagen + Correo */}
          <div className="d-flex align-items-center">
            <motion.img
              src={logo}
              alt="LOGO"
              className="img-fluid"
              style={{
                maxHeight: "80px",
                maxWidth: "80px",
                marginRight: "30px",
                marginLeft: "0px",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
            <Link to="/">
              <motion.button
                type="button"
                className="btn btn-link"
                style={{
                  color: "#254B5E",
                  textDecoration: "none",
                  fontSize: "20px",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Regresar
              </motion.button>
            </Link>
          </div>

          {/* Derecha: Iniciar sesión */}
          <motion.p
            className="mb-0"
            style={{ marginRight: "40px", fontSize: "20px", color: "#254B5E" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Iniciar sesión
          </motion.p>
        </motion.div>

        {/* Contenido */}
        <motion.form
          onSubmit={handleLogin}
          style={{
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
            width: "100%",
            height: "100%",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.p
            className="mb-0"
            style={{ fontSize: "20px", marginTop: "20px", color: "#254B5E" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Correo
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <img
              src={at}
              alt="at"
              style={{
                width: "20px",
                height: "20px",
                marginTop: "10px",
              }}
            />
            <input
              type="email"
              name="correo"
              id="correo"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={{
                width: "350px",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "2px solid #254B5E",
                marginTop: "10px",
                marginLeft: "20px",
                textAlign: "center",
                paddingRight: "30px",
                marginBottom: "20px",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={lock}
                alt="at"
                style={{
                  width: "20px",
                  height: "20px",
                  marginTop: "10px",
                }}
              />
              <input
                type={mostrarContrasena ? "text" : "password"}
                name="contrasena"
                id="contrasena"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                style={{
                  width: "350px",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid #254B5E",
                  marginTop: "10px",
                  marginLeft: "20px",
                  paddingRight: "30px",
                  textAlign: "center",
                }}
              />
              <motion.img
                src={mostrarContrasena ? closeEye : eye}
                alt="eye"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "5px",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              />
            </div>

            {error && (
              <motion.p
                style={{ color: "red", fontSize: "14px", marginBottom: "-5px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
          </motion.div>
          <div className="d-flex justify-content-center align-items-center" style={{ width: "100%" }}>
            <motion.button
              type="submit"
              className="btn w-50 fw-bold"
              style={{
                backgroundColor: "#254B5E",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                marginTop: "20px",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              Ingresar
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}
