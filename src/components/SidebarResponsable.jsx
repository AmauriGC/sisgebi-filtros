import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import menu from "../assets/img/menu.svg";
import asignaciones from "../assets/img/clipboard-check.svg";
import bienes from "../assets/img/package-variant.svg";
import usuario from "../assets/img/account.svg";
import salir from "../assets/img/logout.svg";
import arrow from "../assets/img/arrow-right.svg";

const SidebarItem = ({ icon, label, isExpanded, isSelected, onClick, children }) => {
  return (
    <div>
      <motion.div
        className={`align-items-center p-1 rounded transition-colors ${
          isSelected ? "bg-white fw-bold" : "hover:bg-light"
        }`}
        onClick={onClick}
        style={{
          borderRadius: "10px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textAlign: "start",
          marginBottom: "25px",
          color: isSelected ? "#000" : "#000", // Cambia el color basado en isSelected
        }}
        whileHover={{ scale: 1.05 }} // Efecto hover: se hace un poco más grande
        whileTap={{ scale: 0.9 }} // Efecto al hacer clic
      >
        <img
          src={icon}
          alt={label}
          style={{ width: "32px", height: "32px" }}
          className={`me-4 ${isExpanded ? "" : "p-1"}`}
        />
        {isExpanded && (
          <motion.span
            className="flex-grow-1"
            initial={{ opacity: 0, x: 75 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
      {isExpanded && children}
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [expandedItem, setExpandedItem] = useState("");

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    setExpandedItem(""); // Contraer todas las opciones al expandir/contraer el sidebar
  };

  const expandSidebar = () => {
    setIsExpanded(true);
  };

  const collapseSidebar = () => {
    setIsExpanded(false);
    setExpandedItem(""); // Contraer todas las opciones al contraer el sidebar
  };

  const handleItemClick = (label) => {
    setSelectedItem(label);
    if (expandedItem === label) {
      setExpandedItem("");
    } else {
      setExpandedItem(label);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      //setIsExpanded(window.innerWidth >= 768);
    };
    handleResize(); // Establecer el estado inicial basado en el ancho de la pantalla
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className={`p-3 d-flex flex-column transition-all`}
      style={{
        backgroundColor: "#F1E6D2",
        minHeight: "100vh",
        width: isExpanded ? "250px" : "70px",
        overflow: "hidden",
        transition: "width 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={expandSidebar}
      onMouseLeave={collapseSidebar}
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Botón menú */}
      <SidebarItem
        icon={menu}
        label="Menú"
        isExpanded={isExpanded}
        isSelected={selectedItem === "Menú"}
        onClick={toggleSidebar}
      />

      {/* Opciones del sidebar */}
      <SidebarItem
        icon={usuario}
        label="Perfil"
        isExpanded={isExpanded}
        isSelected={selectedItem === "Perfil"}
        onClick={() => handleItemClick("Perfil")}
      >
        <AnimatePresence>
          {expandedItem === "Perfil" && (
            <motion.div
              className="ps-4"
              style={{ textAlign: "start", marginLeft: "20px" }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onClick={() => navigate("/responsable-dashboard")}
                style={{
                  marginLeft: "-40px",
                }}
              >
                <img src={arrow} alt="arrow" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
                Ver mis datos
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarItem>

      <SidebarItem
        icon={bienes}
        label="Bienes"
        isExpanded={isExpanded}
        isSelected={selectedItem === "Bienes"}
        onClick={() => handleItemClick("Bienes")}
      >
        <AnimatePresence>
          {expandedItem === "Bienes" && (
            <motion.div
              className="ps-4"
              style={{ textAlign: "start", marginLeft: "20px" }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onClick={() => navigate("/bienesResponsable")}
                style={{
                  marginLeft: "-40px",
                }}
              >
                <img src={arrow} alt="arrow" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
                Mostrar bienes
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarItem>

      <SidebarItem
        icon={asignaciones}
        label="Asignaciones"
        isExpanded={isExpanded}
        isSelected={selectedItem === "Asignaciones"}
        onClick={() => handleItemClick("Asignaciones")}
      >
        <AnimatePresence>
          {expandedItem === "Asignaciones" && (
            <motion.div
              className="ps-4"
              style={{ textAlign: "start", marginLeft: "20px" }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onClick={() => navigate("/misAsignacionesResponsable")}
                style={{
                  marginLeft: "-40px",
                }}
              >
                <img src={arrow} alt="arrow" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
                Mostrar asignaciones
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarItem>

      {/* Botón salir al final */}
      <div className="mt-auto">
        <SidebarItem
          icon={salir}
          label="Salir"
          isExpanded={isExpanded}
          onClick={() => {
            sessionStorage.removeItem("token");
            navigate("/");
          }}
        />
      </div>
    </motion.div>
  );
};

export default Sidebar;
