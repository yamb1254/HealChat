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

// Function to call GPT-4 API using fetch
const queryGPT4API = async (data: object) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/engines/gpt-3.5/completions",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.YOUR_OPENAI_API_KEY}`, // Replace with your actual OpenAI API key
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      console.error("Error in API response:", response.status, response.statusText);
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error querying GPT-4 API:", error);
    throw error;
  }
};

// Endpoint to send a message
export const sendMessage = async (req: Request, res: Response) => {
  const { username, content } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.error(`User not found: ${username}`);
      return res.status(400).json({ error: "User not found" });
    }

    const userId = user.id;
    const newMessage = await Chat.create({
      userId,
      content,
      timestamp: new Date(),
    });

    // Call the GPT-4 API
    const response = await queryGPT4API({
      prompt: content,
      max_tokens: 150, // Adjust as needed
      temperature: 0.7, // Adjust as needed
    });

    if (!response || !response.choices || response.choices.length === 0) {
      console.error("No generated text in API response");
      return res.status(500).json({ error: "Failed to generate response from the model" });
    }

    const modelResponse = response.choices[0].text;

    res.status(201).json({ newMessage, modelResponse });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Endpoint to get all messages
export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Chat.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
