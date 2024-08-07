import axios from "axios";
let myUrl: string;
if (window.location.href.includes("localhost")) {
  myUrl = "http://localhost:5000/api";
} else {
  myUrl = "https://healchat.onrender.com/api";
}

const apiClient = axios.create({
  baseURL: myUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
