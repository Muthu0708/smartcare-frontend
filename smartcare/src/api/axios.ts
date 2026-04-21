import axios from "axios";



const API = axios.create({
  baseURL:import.meta.env.VITE_API_URL || "http://localhost:5002/api",
  withCredentials: true 
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for logout
    if (originalRequest.url.includes("/auth/logout")) {
      return Promise.reject(error);
    }

    //handle token expiry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await API.post("/auth/refresh");
        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;