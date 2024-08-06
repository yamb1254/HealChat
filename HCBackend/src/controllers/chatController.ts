import { Request, Response } from "express";
import axios from "axios";
import multer from "multer";
import Chat from "../models/chatModel";
import User from "../models/userModel";
import OpenAI from "openai";

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


const openai = new OpenAI({
  baseURL: "https://k8ru910giiqrflsa.us-east-1.aws.endpoints.huggingface.cloud/v1/",
  apiKey: "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" // Replace with your actual Hugging Face API key
});

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

    // Call the Hugging Face model server using OpenAI client
    const response = await openai.chat.completions.create({
      model: "tgi",
      messages: [
        {
          role: "user",
          content: content
        }
      ],
      max_tokens: 1000 // Adjust the max tokens as needed
    });

    const modelResponse = response.choices[0].message.content;

    res.status(201).json({ newMessage, modelResponse });
  } catch (error) {
    console.error("Error generating response:", error);
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
