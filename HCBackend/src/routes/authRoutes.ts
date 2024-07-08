import { Router } from "express";
import { signup, login, forgotPassword } from "../controllers/authController";

const router = Router();

router.post("/for", () => console.log("hello"));
router.post("/signup", signup);
router.post("/login", login);

export default router;
