import dotenv from "dotenv";

dotenv.config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "your_secret_key",
  emailUser: process.env.EMAIL_USER, // Add this line
  emailPass: process.env.EMAIL_PASS,
};
