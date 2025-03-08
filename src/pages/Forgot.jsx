import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import at from "../assets/img/at.svg";

export default function Forgot() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");

  const correoValido = /^[a-zA-Z0-9@._´-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!correoValido.test(correo) || !correo.includes("@")) {
      setError("Correo inválido. Solo se permiten caracteres alfanuméricos.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/auth/forgot?correo=${correo}`
      );

      if (response.status === 200) {
        navigate("/form");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError("Correo inválido. Solo se permiten caracteres alfanuméricos.");
      }
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center">
      <div
        className="container"
        style={{
          width: "500px",
          height: "400px",
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="d-flex align-items-center">
            <Link to="/">
              <button
                type="button"
                className="btn btn-link"
                style={{
                  color: "#254B5E",
                  textDecoration: "none",
                  fontSize: "20px",
                  marginRight: "20px",
                }}
              >
                Regresar
              </button>
            </Link>

            <text
              className="btn btn-link"
              style={{
                color: "#254B5E",
                textDecoration: "none",
                fontSize: "20px",
              }}
            >
              Olvide mis datos
            </text>
          </div>
        </div>

        <p
          className="mb-0"
          style={{ fontSize: "20px", marginTop: "20px", color: "#254B5E" }}
        >
          Ayuda de la cuenta
        </p>
        {/* Contenido */}
        <form
          onSubmit={handleLogin}
          style={{
            padding: "40px",
            paddingTop: "0px",
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

            {error && (
              <p
                style={{
                  color: "red",
                  fontSize: "14px",
                  marginTop: "10px",
                  marginBottom: "-5px",
                }}
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
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
