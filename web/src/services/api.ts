import axios from "axios";
import Cookies from "js-cookie";

const BaseURL =
  import.meta.env.VITE_API_URL || "https://crud-api.fadhildev.my.id/api/v1";

const Api = axios.create({
  baseURL: BaseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Add request interceptor to include token
Api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url || "";

    // If 401 and NOT from login/register endpoint, clear cookies and redirect
    if (error.response?.status === 401) {
      // Don't redirect if error is from login or register
      if (!requestUrl.includes("/login") && !requestUrl.includes("/register")) {
        Cookies.remove("token");
        Cookies.remove("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default Api;
