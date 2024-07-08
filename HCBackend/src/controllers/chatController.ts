import { Request, Response } from "express";
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
  const { content } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const imageUrl = req.file ? req.file.path : null;

  try {
    const newMessage = await Chat.create({
      userId,
      content,
      timestamp: new Date(),
    });
    res.status(201).json(newMessage);
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
