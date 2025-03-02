import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./assets/css/Login.css";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8080/auth/login?correo=${correo}&contrasena=${contrasena}`
      );

      const { token, rol } = response.data;

      sessionStorage.setItem("token", token);

      if (rol === "ADMINISTRADOR") {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError("Credenciales incorrectas");
      console.error(err);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          style={{ margin: "10px 0" }}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          style={{ margin: "10px 0" }}
        />
        <br />
        <button type="submit" style={{ margin: "10px 0" }}>
          Iniciar sesión
        </button>
      </form>
      {error && <p style={{ textAlign: "center" }}>{error}</p>}
    </div>
  );
};

export default Login;
