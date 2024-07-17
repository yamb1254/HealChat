import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://asp-liked-redbird.ngrok-free.app/api/auth/login/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
