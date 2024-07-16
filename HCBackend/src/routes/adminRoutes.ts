import { Router } from "express";
import { getUsers } from "../controllers/adminController";

const router = Router();

router.get("/users", getUsers);

export default router;
