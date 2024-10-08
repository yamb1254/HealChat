import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "your_secret_key",
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  resetTokenSecret: process.env.RESET_TOKEN_SECRET || "your_reset_token_secret",
};
