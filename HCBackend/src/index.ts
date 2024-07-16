import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes"; // Ensure this path is correct
import chatRoutes from "./routes/chatRoutes";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://heal-chat.vercel.app/', 'heal-chat-git-work-branch-yamb1254s-projects.vercel.app','http://localhost:3000'], // Add your frontend URL here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  // console.log("Environment configuration:", process.env);
});

export default app;
