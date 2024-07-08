"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.sendMessage = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
// Configure multer for file storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.uploadMiddleware = upload.single("image");
// Handle sending a message
const sendMessage = async (req, res) => {
    const { userId, content } = req.body;
    try {
        const newMessage = await chatModel_1.default.create({
            userId,
            content,
            timestamp: new Date(),
        });
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.sendMessage = sendMessage;
// Handle retrieving messages
const getMessages = async (req, res) => {
    try {
        const messages = await chatModel_1.default.findAll();
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getMessages = getMessages;
