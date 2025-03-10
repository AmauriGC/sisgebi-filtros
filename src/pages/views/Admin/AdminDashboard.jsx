import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";

const AdminDashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <h1>perfil</h1>
      <h3>Datos</h3>
    </div>
  );
};

export default AdminDashboard;
