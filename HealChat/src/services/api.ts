import axios from "axios";

const api = axios.create({
  baseURL: "https://your-vercel-deployment-url/api",
});

export const signUp = (email: string, password: string) =>
  api.post("/signup", { email, password });
export const login = (email: string, password: string) =>
  api.post("/login", { email, password });
export const chatSocket = "https://your-vercel-deployment-url/api/chat";
