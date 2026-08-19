import express from "express";
import { bootstrapOrganization } from "@/controllers/organization/bootstrap.js";
import { createOrganisationInvite } from "@/controllers/organization/invite.js";
import authMiddleware from "@/middleware/auth-middleware.js";

const router = express.Router();

router.post("/bootstrap", authMiddleware, bootstrapOrganization);
router.post("/invites", authMiddleware, createOrganisationInvite);

export default router;
