import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://bczckdjlrc.loclx.io/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
