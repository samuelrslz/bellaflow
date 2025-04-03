import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/management/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
      config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;
