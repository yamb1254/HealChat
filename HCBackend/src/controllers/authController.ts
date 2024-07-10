import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { config } from "../config/envConfig";

// Function to handle user signup
export const signup = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      role: "user",
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Function to handle user login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ message: "Login successful", token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Function to validate username and email for password reset
export const validateUser = async (req: Request, res: Response) => {
  const { username, email } = req.body;

  try {
    const user = await User.findOne({ where: { username, email } });
    if (!user) {
      return res.status(404).json({ message: "Invalid username or email" });
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: "10m",
    });

    res.status(200).json({ message: "Validation successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Function to handle reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    const decoded: any = jwt.verify(token, config.jwtSecret);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};

// Add this function to get user information
export const getUserInfo = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
