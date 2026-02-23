import axios from "axios";

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_BASE_URL || "https://growthbackend.onrender.com") + "/api",
  headers: {
    Accept: "application/json",
  },
});

// Attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;