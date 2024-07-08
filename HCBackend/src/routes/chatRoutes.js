"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/send", authMiddleware_1.verifyToken, chatController_1.uploadMiddleware, chatController_1.sendMessage);
router.get("/messages", authMiddleware_1.verifyToken, chatController_1.getMessages);
exports.default = router;
