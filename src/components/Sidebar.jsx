import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import menu from "../assets/img/menu.svg";
import asignaciones from "../assets/img/clipboard-check.svg";
import bienes from "../assets/img/package-variant.svg";
import catalogos from "../assets/img/book.svg";
import usuario from "../assets/img/account.svg";
import usuarios from "../assets/img/account-group.svg";
import salir from "../assets/img/logout.svg";
import areas from "../assets/img/office-building-marker.svg";
import modelos from "../assets/img/laptop.svg";
import marcas from "../assets/img/text-box-outline.svg";
import tipos from "../assets/img/packages.png";
import arrow from "../assets/img/arrow-right.svg";

const SidebarItem = ({ icon, label, isExpanded, isSelected, onClick, children }) => {
  return (
    <div>
      <div
        className={`d-flex align-items-center p-1 cursor-pointer rounded transition-colors ${
          isSelected ? "bg-white fw-bold" : "hover:bg-light"
        }`}
        onClick={onClick}
        style={{
          borderRadius: "10px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          marginBottom: "25px",
          textAlign: "start",
          color: "#254B5E",
        }}
      >
        <img
          src={icon}
          alt={label}
          style={{ width: "32px", height: "32px" }}
          className={`me-2 ${isExpanded ? "" : "p-1"}`}
        />
        {isExpanded && <span className="flex-grow-1">{label}</span>}
      </div>
      {isExpanded && children}
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [expandedItem, setExpandedItem] = useState("");

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const expandSidebar = () => setIsExpanded(true);
  const collapseSidebar = () => setIsExpanded(false);

  const handleItemClick = (label) => {
    setSelectedItem(label);
    if (expandedItem === label) {
      setExpandedItem("");
    } else {
      setExpandedItem(label);
    }
  };

  // Manejo de redimensionamiento de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`p-3 d-flex flex-column transition-all `}
      style={{
        backgroundColor: "#A7D0D2",
        minHeight: "100vh",
        width: isExpanded ? "250px" : "70px",
        overflow: "hidden",
        transition: "width 0.2s ease",
      }}
      onMouseEnter={expandSidebar}
      onMouseLeave={collapseSidebar}
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
        {expandedItem === "Perfil" && (
          <div className="ps-4" style={{ textAlign: "start", marginLeft: "20px" }}>
            <div
              onClick={() => navigate("/admin-dashboard")}
              style={{
                marginTop: "-20px",
                marginBottom: "20px",
                marginLeft: "-40px",
              }}
            >
              <img src={arrow} alt="arrow" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
              Ver mis datos
            </div>
            {/* Otras opciones de submenú */}
          </div>
        )}
      </SidebarItem>

      <SidebarItem
        icon={bienes}
        label="Bienes"
        isExpanded={isExpanded}
        isSelected={selectedItem === "Bienes"}
        onClick={() => handleItemClick("Bienes")}
      >
        {expandedItem === "Bienes" && (
          <div className="ps-4" style={{ textAlign: "start", marginLeft: "20px", marginRight: "15px" }}>
            <div
              onClick={() => navigate("/bienes")}
              style={{
                marginTop: "-20px",
                marginBottom: "20px",
                marginLeft: "-40px",
              }}
            >
              <img src={arrow} alt="arrow" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
              Mostrar bienes
            </div>
            {/* Otras opciones de submenú */}
          </div>
        )}
      </SidebarItem>

      <SidebarItem
        icon={usuarios}
        label="Usuarios"
        isExpanded={isExpanded}
        isSelected={selectedItem === "Usuarios"}
        onClick={() => handleItemClick("Usuarios")}
      >
        {expandedItem === "Usuarios" && (
          <div className="ps-4" style={{ textAlign: "start", marginLeft: "20px" }}>
            <div
              onClick={() => navigate("/usuarios")}
              style={{
                marginTop: "-20px",
                marginBottom: "20px",
                marginLeft: "-40px",
              }}
            >
              <img src={arrow} alt="arrow" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
              Mostrar usuarios
            </div>
            {/* Otras opciones de submenú */}
          </div>
        )}
      </SidebarItem>

      <SidebarItem
        icon={catalogos}
        label="Catálogos"
        isExpanded={isExpanded}
        isSelected={selectedItem === "Catálogos"}
        onClick={() => handleItemClick("Catálogos")}
      >
        {expandedItem === "Catálogos" && (
          <div className="ps-4" style={{ textAlign: "start", marginLeft: "20px" }}>
            <div
              onClick={() => navigate("/areas")}
              style={{
                marginTop: "-20px",
                marginBottom: "30px",
                marginLeft: "-40px",
              }}
            >
              <img src={areas} alt="areas" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
              Áreas comunes
            </div>
            <div
              onClick={() => navigate("/tipos")}
              style={{
                marginTop: "-20px",
                marginBottom: "30px",
                marginLeft: "-40px",
              }}
            >
              <img src={tipos} alt="tipos" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
              Tipos de bienes
            </div>
            <div
              onClick={() => navigate("/marcas")}
              style={{
                marginTop: "-20px",
                marginBottom: "30px",
                marginLeft: "-40px",
              }}
            >
              <img src={marcas} alt="marcas" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
              Marcas
            </div>
            <div
              onClick={() => navigate("/modelos")}
              style={{
                marginTop: "-20px",
                marginBottom: "30px",
                marginLeft: "-40px",
              }}
            >
              <img src={modelos} alt="modelos" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
              Modelos
            </div>
            {/* Otras opciones de submenú */}
          </div>
        )}
      </SidebarItem>

      <SidebarItem
        icon={asignaciones}
        label="Asignaciones"
        isExpanded={isExpanded}
        isSelected={selectedItem === "Asignaciones"}
        onClick={() => handleItemClick("Asignaciones")}
      >
        {expandedItem === "Asignaciones" && (
          <div className="ps-4" style={{ textAlign: "start", marginLeft: "20px" }}>
            <div
              onClick={() => navigate("/asignaciones")}
              style={{
                marginTop: "-20px",
                marginBottom: "20px",
                marginLeft: "-40px",
              }}
            >
              <img src={arrow} alt="arrow" style={{ width: "20px", height: "20px", marginRight: "15px" }} />
              Mostrar asignaciones
            </div>
            {/* Otras opciones de submenú */}
          </div>
        )}
      </SidebarItem>

      {/* Botón salir al final */}
      <div className="mt-auto">
        <SidebarItem
          icon={salir}
          label="Salir"
          isExpanded={isExpanded}
          onClick={() => {
            handleItemClick("Salir");
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
