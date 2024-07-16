import { Request, Response } from "express";
import axios from "axios";
import multer from "multer";
import Chat from "../models/chatModel";
import User from "../models/userModel";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadMiddleware = upload.single("image");

export const sendMessage = async (req: Request, res: Response) => {
  const { username, content } = req.body;

  const user = await User.findOne({ where: { username } });
  const userId = user?.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const newMessage = await Chat.create({
      userId,
      content,
      timestamp: new Date(),
    });

    // Call the Python model server
    const response = await axios.post('https://093b-104-154-83-69.ngrok-free.app/generate', { text: content });
    const modelResponse = response.data.response;

    res.status(201).json({ newMessage, modelResponse });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Chat.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
