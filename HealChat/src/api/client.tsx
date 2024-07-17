import axios from "axios";

const apiClient = axios.create({
  baseURL: "healchatserver.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
