"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const getUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getUsers = getUsers;
