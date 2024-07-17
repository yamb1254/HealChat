import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/envConfig";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied" });
  }

  const token = authHeader.split(' ')[1]; // Extract the token
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, config.jwtSecret) as JwtPayload & {
      userId: number;
    };
    if (verified) {
      req.user = verified; // Optionally, attach the user to the request
      next();
    } else {
      return res.status(401).json({ error: "Access denied" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
