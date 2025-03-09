import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/img/ICON.png";
import at from "../assets/img/at.svg";
import lock from "../assets/img/lock-outline.svg";
import closeEye from "../assets/img/eye-off-outline.svg";
import eye from "../assets/img/eye-outline.svg";

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

    if (!correoValido.test(correo) || !correo.includes("@")) {
      setError("Correo inválido. Solo se permiten caracteres alfanuméricos.");
      return;
    }

    if (!contrasenaValida.test(contrasena)) {
      setError(
        "Contraseña inválida. Solo se permiten caracteres alfanuméricos."
      );
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/auth/login?correo=${correo}&contrasena=${contrasena}`
      );

      const { token, rol } = response.data;
      sessionStorage.setItem("token", token);

      if (rol === "ADMINISTRADOR") {
        navigate("/perfil");
      } else if (rol === "BECARIO") {
        navigate("/becario-dashboard");
      } else if (rol === "RESPONSABLE") {
        navigate("/responsable-dashboard");
      }
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center">
      <div
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
      >
        {/* Encabezado */}
        <div
          style={{
            backgroundColor: "#A7D0D2",
            height: "200px",
            width: "500px",
            borderRadius: "15px 15px 0 0",
            padding: "40px",
          }}
          className="d-flex justify-content-between align-items-center"
        >
          {/* Izquierda: Imagen + Correo */}
          <div className="d-flex align-items-center">
            <img
              src={logo}
              alt="LOGO"
              className="img-fluid"
              style={{
                maxHeight: "80px",
                maxWidth: "80px",
                marginRight: "30px",
                marginLeft: "0px",
              }}
            />
            <Link to="/">
              <button
                type="button"
                className="btn btn-link"
                style={{
                  color: "#254B5E",
                  textDecoration: "none",
                  fontSize: "20px",
                }}
              >
                Regresar
              </button>
            </Link>
          </div>

          {/* Derecha: Iniciar sesión */}
          <p
            className="mb-0"
            style={{ marginRight: "40px", fontSize: "20px", color: "#254B5E" }}
          >
            Iniciar sesión
          </p>
        </div>

        {/* Contenido */}
        <form
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
        >
          <p
            className="mb-0"
            style={{ fontSize: "20px", marginTop: "20px", color: "#254B5E" }}
          >
            Correo
          </p>
          <div>
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
              }}
            />
            <p>No compartas tu correo con nadie por favor</p>
          </div>

          <div>
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
              <img
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
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              />
            </div>

            {error && (
              <p
                style={{ color: "red", fontSize: "14px", marginBottom: "-5px" }}
              >
                {error}
              </p>
            )}
          </div>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: "100%" }}
          >
            <button
              type="submit"
              className="btn w-50 fw-bold"
              style={{
                backgroundColor: "#254B5E",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                marginTop: "20px",
              }}
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
