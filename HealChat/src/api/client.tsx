import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: "${API_BASE_URL}/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
