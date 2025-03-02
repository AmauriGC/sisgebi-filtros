// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Catalogos = () => {
//   const [catalogos, setCatalogos] = useState([]);
  
//   useEffect(() => {
//     // Traer los catálogos de la API
//     axios.get('http://localhost:8080/api/catalogos')
//       .then(response => setCatalogos(response.data))
//       .catch(error => console.error(error));
//   }, []);

//   return (
//     <div className="catalogos">
//       <h1>Gestión de Catálogos</h1>
//       <button>Agregar Nuevo Registro</button>
//       <table>
//         <thead>
//           <tr>
//             <th>Marca</th>
//             <th>Tipo</th>
//             <th>Modelo</th>
//             <th>Área</th>
//             <th>Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {catalogos.map(catalogo => (
//             <tr key={catalogo.id}>
//               <td>{catalogo.marca}</td>
//               <td>{catalogo.tipo}</td>
//               <td>{catalogo.modelo}</td>
//               <td>{catalogo.area}</td>
//               <td>
//                 <button>Editar</button>
//                 <button>Eliminar</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Catalogos;
