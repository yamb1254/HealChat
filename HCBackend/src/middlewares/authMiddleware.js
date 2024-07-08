"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = require("../config/envConfig");
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access denied" });
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, envConfig_1.config.jwtSecret);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
const verifyAdmin = (req, res, next) => {
    (0, exports.verifyToken)(req, res, () => {
        if (req.user && typeof req.user !== "string" && req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    });
};
exports.verifyAdmin = verifyAdmin;
