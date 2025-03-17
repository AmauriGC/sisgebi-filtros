import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div
      className="d-flex min-vh-100 align-items-center justify-content-center"
      style={{ background: "linear-gradient(135deg, #254b5e, #546eab, #4697b4, #a7d0d2)", gap: "100px" }}
    >
      {/* Sección izquierda (cambia de color dinámicamente) */}
      <div
        className="d-flex flex-column align-items-center col-6 col-sm-6 col-md-4 col-lg-4"
        style={{ alignSelf: "flex-start" }}
      >
        <div
          className="p-5 shadow text-center d-flex flex-column"
          style={{
            width: "420px",
            height: "580px",
            borderRadius: "0 0 15px 15px",
            backgroundColor: colores[rol].fondo,
            color: colores[rol].texto,
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          <div className="d-flex justify-content-center">
            <img
              src={logo}
              alt="LOGO"
              className="img-fluid mt-3 mb-3 p-3 "
              style={{ maxHeight: "240px", maxWidth: "240px", borderRadius: "50%" }}
            />
          </div>

          {/* Cambia dinámicamente el texto */}
          <p className="fw-bold fs-3 mt-3">{rol || "USUARIO"}</p>

          {/* Botones abajo */}
          <div className="mt-auto d-flex flex-row gap-3 justify-content-center">
            <button
              className="btn w-50 fw-bold"
              style={{
                backgroundColor: colores[rol].btnFondo,
                color: colores[rol].btnTexto,
                height: "60px",
              }}
              onClick={() => navigate("/forgot")}
            >
              Olvidé mis datos
            </button>
            <button
              className="btn w-50 fw-bold"
              style={{
                backgroundColor: colores[rol].btnFondo,
                color: colores[rol].btnTexto,
              }}
              onClick={() => navigate("/form")}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Sección derecha (selección de rol) */}
      <div
        className="d-flex flex-column align-items-center col-6 col-sm-6 col-md-4 col-lg-4"
        style={{ alignSelf: "flex-end" }}
      >
        <div
          className="bg-white p-5 shadow text-center"
          style={{
            width: "420px",
            height: "580px",
            borderRadius: "15px 15px 0 0",
          }}
        >
          <div className="mx-auto" style={{ width: "120px", height: "120px" }}>
            {/* Imagen que cambia según el rol */}
            <img
              src={imagenRol[rol]}
              className="img-fluid"
              style={{
                maxHeight: "240px",
                maxWidth: "240px",
                backgroundColor: rol === "" ? "transparent" : colores[rol].fondo,
                borderRadius: "50%",
                padding: rol === "" ? "0" : "10px",
              }}
            />
          </div>

          <p className="fs-5 mt-3">Bienvenido a</p>
          <p className="fw-bold fs-3">SISGEBI</p>
          <div className="mt-4 d-flex flex-column gap-3 align-items-center">
            {/* Al hacer clic en un botón, cambia el rol y el color de la tarjeta izquierda */}
            <button
              className="btn w-100 text-center p-4 shadow-sm"
              style={{
                backgroundColor: "#A7D0D2",
                color: "#254B5E",
                borderRadius: "10px",
              }}
              onClick={() => setRol("Administrador")}
            >
              Administrador
            </button>
            <button
              className="btn w-100 text-center p-4 shadow-sm"
              style={{
                backgroundColor: "#F1E6D2",
                color: "#254B5E",
                borderRadius: "10px",
              }}
              onClick={() => setRol("Responsable")}
            >
              Responsable
            </button>
            <button
              className="btn w-100 text-center p-4 shadow-sm"
              style={{
                backgroundColor: "#546EAB",
                color: "#F1E6D2",
                borderRadius: "10px",
              }}
              onClick={() => setRol("Becario")}
            >
              Becario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
