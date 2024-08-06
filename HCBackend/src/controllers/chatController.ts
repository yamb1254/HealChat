import { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import Replicate from "replicate";
import Chat from "../models/chatModel";
import User from "../models/userModel";
import fetch from "node-fetch";

// Configure dotenv
dotenv.config();

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

// Setup Replicate API
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
  userAgent: "https://www.npmjs.com/package/create-replicate",
});

const model = "meta/meta-llama-3-70b-instruct:fbfb20b472b2f3bdd101412a9f70a0ed4fc0ced78a77ff00970ee7a2383c575d";

// Function to call Replicate API using the Llama 3 model
const queryLlama3API = async (prompt: string): Promise<any> => {
  const input = {
    top_p: 0.9,
    prompt,
    max_tokens: 512,
    min_tokens: 0,
    temperature: 0.6,
    prompt_template: "system\n\nYou are a helpful assistantuser\n\n{prompt}assistant\n\n",
    presence_penalty: 1.15,
    frequency_penalty: 0.2,
  };

  console.log("Using model: %s", model);
  console.log("With input: %O", input);

  console.log("Running...");
  const output = await replicate.run(model, { input });
  console.log("Done!", output);

  return output;
};

// Function to handle sending messages
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { username, content } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.error(`User not found: ${username}`);
      res.status(400).json({ error: "User not found" });
      return;
    }

    const userId = user.id;

    const newMessage = await Chat.create({
      userId,
      content,
      timestamp: new Date(),
    });

    // Call the Llama 3 API
    const response = await queryLlama3API(content);
    console.log("Done2!", response);

    // if (!response || !response.output) {
    //   console.error("No generated text in API response");
    //   res.status(500).json({ error: "Failed to generate response from the model" });
    //   return;
    // }

    // Join the array of tokens into a single string
    const modelResponse = response.output.join(" ");
    console.log("Done3!", modelResponse);

    res.status(201).json({ newMessage, modelResponse });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get messages
export const getMessages = async (req: Request, res: Response): Promise<void> => {
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
