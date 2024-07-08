import { Router } from "express";
import { getUsers } from "../controllers/adminController";
import { verifyAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.get("/users", verifyAdmin, getUsers);

export default router;
