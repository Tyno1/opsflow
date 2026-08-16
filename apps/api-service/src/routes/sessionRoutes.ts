import express from "express";
import { validateSession } from "../controllers/sessionController.js";

const router = express.Router();

router.post("/auth/session", validateSession);

export default router;
