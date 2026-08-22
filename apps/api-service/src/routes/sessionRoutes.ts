import express from "express";
import { validateSession } from "@/controllers/auth/session.js";
import authMiddleware from "@/middleware/auth-middleware.js";

const router = express.Router();

router.post("/auth/session", authMiddleware, validateSession);

export default router;
