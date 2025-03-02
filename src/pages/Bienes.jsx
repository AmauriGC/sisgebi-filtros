// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Bienes = () => {
//   const [bienes, setBienes] = useState([]);

//   useEffect(() => {
//     // Aquí deberías traer los bienes desde la API
//     axios.get('http://localhost:8080/api/bienes')
//       .then(response => setBienes(response.data))
//       .catch(error => console.error(error));
//   }, []);

//   return (
//     <div className="bienes">
//       <h1>Gestión de Bienes</h1>
//       <button>Crear Nuevo Bien</button>
//       <table>
//         <thead>
//           <tr>
//             <th>Nombre</th>
//             <th>Tipo</th>
//             <th>Marca</th>
//             <th>Modelo</th>
//             <th>Ubicación</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bienes.map(bien => (
//             <tr key={bien.id}>
//               <td>{bien.nombre}</td>
//               <td>{bien.tipo}</td>
//               <td>{bien.marca}</td>
//               <td>{bien.modelo}</td>
//               <td>{bien.ubicacion}</td>
//               <td>
//                 <button>Editar</button>
//                 <button>Dar de Baja</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Bienes;
