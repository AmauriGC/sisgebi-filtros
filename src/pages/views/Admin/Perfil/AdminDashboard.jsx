import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../../../../components/Sidebar";

const AdminDashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      showUnauthorizedAlert();
      return;
    }

    const decodedToken = jwtDecode(token);
    const id = decodedToken.id;
    const role = decodedToken.role;

    if (role !== "ADMINISTRADOR") {
      showUnauthorizedAlert();
      return;
    }

    setIsLoading(true);
    axios
      .get(`http://localhost:8080/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsuario(response.data);
      })
      .catch((error) => {
        showErrorAlert();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  const showUnauthorizedAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Acceso no autorizado",
      text: "No tienes permiso para acceder a esta página.",
      showConfirmButton: false,
      timer: 3000,
    }).then(() => {
      navigate("/");
    });
  };

  const showErrorAlert = () => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar los datos del usuario. Inténtalo de nuevo más tarde.",
      showConfirmButton: false,
      timer: 3000,
    }).then(() => {
      navigate("/");
    });
  };

  // Variantes para animaciones coordinadas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <AnimatePresence>
          {isLoading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "5px solid #254B5E",
                  borderTopColor: "transparent",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ) : usuario ? (
            <motion.div
              key="profile-card"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                padding: "30px",
                maxWidth: "600px",
                width: "100%",
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.h1
                  variants={itemVariants}
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    color: "#254B5E",
                    textAlign: "center",
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  Perfil del Usuario
                  <motion.span
                    style={{
                      position: "absolute",
                      bottom: "-5px",
                      left: "0",
                      width: "100%",
                      height: "3px",
                      backgroundColor: "#254B5E",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                </motion.h1>

                <motion.div
                  variants={containerVariants}
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <motion.div
                    variants={itemVariants}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      textAlign: "start",
                    }}
                  >
                    <motion.strong
                      whileHover={{ scale: 1.05, color: "#1a3643" }}
                      style={{ color: "#254B5E", display: "inline-block" }}
                    >
                      Nombres:
                    </motion.strong>
                    <motion.strong
                      whileHover={{ scale: 1.05, color: "#1a3643" }}
                      style={{ color: "#254B5E", display: "inline-block" }}
                    >
                      Apellidos:
                    </motion.strong>
                    <motion.strong
                      whileHover={{ scale: 1.05, color: "#1a3643" }}
                      style={{ color: "#254B5E", display: "inline-block" }}
                    >
                      Correo:
                    </motion.strong>
                    <motion.strong
                      whileHover={{ scale: 1.05, color: "#1a3643" }}
                      style={{ color: "#254B5E", display: "inline-block" }}
                    >
                      Lugar:
                    </motion.strong>
                    <motion.strong
                      whileHover={{ scale: 1.05, color: "#1a3643" }}
                      style={{ color: "#254B5E", display: "inline-block" }}
                    >
                      Rol:
                    </motion.strong>
                    <motion.strong
                      whileHover={{ scale: 1.05, color: "#1a3643" }}
                      style={{ color: "#254B5E", display: "inline-block" }}
                    >
                      Estado:
                    </motion.strong>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      textAlign: "start",
                    }}
                  >
                    <motion.span whileHover={{ scale: 1.02, x: 5 }} style={{ color: "#333", display: "inline-block" }}>
                      {usuario.nombres}
                    </motion.span>
                    <motion.span whileHover={{ scale: 1.02, x: 5 }} style={{ color: "#333", display: "inline-block" }}>
                      {usuario.apellidos}
                    </motion.span>
                    <motion.span whileHover={{ scale: 1.02, x: 5 }} style={{ color: "#333", display: "inline-block" }}>
                      {usuario.correo}
                    </motion.span>
                    <motion.span whileHover={{ scale: 1.02, x: 5 }} style={{ color: "#333", display: "inline-block" }}>
                      {usuario.lugar}
                    </motion.span>
                    <motion.span whileHover={{ scale: 1.02, x: 5 }} style={{ color: "#333", display: "inline-block" }}>
                      {usuario.rol}
                    </motion.span>
                    <motion.span whileHover={{ scale: 1.02, x: 5 }} style={{ color: "#333", display: "inline-block" }}>
                      {usuario.status}
                    </motion.span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: "#254B5E", fontWeight: "bold" }}
            >
              No se encontraron datos del usuario.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
