import axios from "axios";

const API_URL = "http://localhost:8080/api/usuarios";

const getUsuarios = (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getLugares = (token) => {
  return axios.get(`${API_URL}/lugares`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const filterUsuarios = (token, params) => {
  return axios.get(`${API_URL}/filter`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
};

const crearUsuario = (token, usuario) => {
  return axios.post(API_URL, usuario, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const actualizarUsuario = (token, id, usuario) => {
  return axios.put(`${API_URL}/${id}`, usuario, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const eliminarUsuario = (token, id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  getUsuarios,
  getLugares,
  filterUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};