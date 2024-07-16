import { Router } from "express";
import {
  sendMessage,
  getMessages,
  uploadMiddleware,
} from "../controllers/chatController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.post("/send", verifyToken, uploadMiddleware, sendMessage);
router.get("/messages", verifyToken, getMessages);

export default router;
