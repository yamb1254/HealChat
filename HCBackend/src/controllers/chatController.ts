import { Request, Response } from "express";
import multer from "multer";
import Chat from "../models/chatModel";
import User from "../models/userModel";
import fetch from "node-fetch";

// Multer storage setup for file uploads
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

// Function to call Llama 3 API using fetch
const queryLlama3API = async (data: object) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B",
      {
        headers: {
          Authorization: "Bearer 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", // Replace with your actual Hugging Face API key
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      console.error("Error in API response:", response.statusText);
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("API response:", result);
    return result;
  } catch (error) {
    console.error("Error querying Llama 3 API:", error);
    throw error;
  }
};

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

    // Call the Llama 3 API
    const response = await queryLlama3API({ inputs: content });

    if (!response || !response.generated_text) {
      console.error("No generated text in API response");
      return res.status(500).json({ error: "Failed to generate response from the model" });
    }

    const modelResponse = response.generated_text;

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
