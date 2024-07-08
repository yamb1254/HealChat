"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = require("../config/envConfig");
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, envConfig_1.config.jwtSecret, { expiresIn: "1h" });
};
exports.generateToken = generateToken;
