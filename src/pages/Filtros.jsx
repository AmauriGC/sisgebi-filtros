// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Usuarios = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       navigate("/");
//     }
//   }, [navigate]);

//   // Funciones de navegación
//   const navigateTo = (path) => {
//     navigate(path);
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       <div
//         style={{
//           padding: "30px",
//           backgroundColor: "#f4f6f9",
//           borderRadius: "8px",
//           width: "100%",
//           maxWidth: "1200px",
//           margin: "0 auto",
//         }}
//       >
//         <h1
//           style={{
//             fontSize: "32px",
//             fontWeight: "600",
//             marginBottom: "20px",
//           }}
//         >
//           Gestión de Usuarios
//         </h1>
//         <p style={{ fontSize: "18px", color: "#666", marginBottom: "30px" }}>
//           Seleccione una de las siguientes opciones para gestionar los usuarios.
//         </p>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           <div style={buttonStyle} onClick={() => navigateTo("/usuarios/ver")}>
//             <h3>Ver Usuarios</h3>
//           </div>

//           <div style={buttonStyle} onClick={() => navigateTo("/marcas/ver")}>
//             <h3>Ver marcas</h3>
//           </div>
//           <div style={buttonStyle} onClick={() => navigateTo("/modelos/ver")}>
//             <h3>Ver modelos</h3>
//           </div>
//           <div style={buttonStyle} onClick={() => navigateTo("/areas/ver")}>
//             <h3>Ver areas comunes</h3>
//           </div>

//           <div style={buttonStyle} onClick={() => navigateTo("/tipos/ver")}>
//             <h3>Ver tipos bien</h3>
//           </div>

//           <div style={buttonStyle} onClick={() => navigateTo("/bienes/ver")}>
//             <h3>Ver bien</h3>
//           </div>

//           <div
//             style={buttonStyle}
//             onClick={() => navigateTo("/asignaciones/ver")}
//           >
//             <h3>Ver asignaciones</h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const buttonStyle = {
//   backgroundColor: "#ffffff",
//   padding: "20px",
//   borderRadius: "8px",
//   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//   cursor: "pointer",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
//   textAlign: "center",
// };

// export default Usuarios;
