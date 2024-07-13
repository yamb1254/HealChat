import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/envConfig";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  console.log(" hello", req.header("Authorization"));
  //const token = req.cookies.
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  try {
    const verified = jwt.verify(token, config.jwtSecret) as JwtPayload & {
      userId: number;
    };
    if (verified) next();
    else return res.status(401).json({ error: "Access denied" });
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};
