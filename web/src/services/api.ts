import axios from "axios";

const BaseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const Api = axios.create({
  baseURL: BaseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default Api;
