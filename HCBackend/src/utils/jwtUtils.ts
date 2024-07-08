import jwt from "jsonwebtoken";
import { config } from "../config/envConfig";

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: "1h" });
};
