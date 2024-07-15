import { Router } from "express";
import { login } from "../controllers/authController";
import { signup } from "../controllers/authController";
import { getUserInfo } from "../controllers/authController";
import { validateUser } from "../controllers/authController";
import { resetPassword } from "../controllers/authController";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/validate-user", validateUser); 
router.post("/reset-password", resetPassword);
router.get("/user-info", getUserInfo);

export default router;
