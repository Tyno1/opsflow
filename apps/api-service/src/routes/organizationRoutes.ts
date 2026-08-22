import express from "express";
import { bootstrapOrganization } from "@/controllers/organization/bootstrap.js";
import {
	createOrganisationInvite,
	deleteOrganisationInvite,
	getOrganisationInvite,
} from "@/controllers/organization/invite.js";
import authMiddleware from "@/middleware/auth-middleware.js";

const router = express.Router();

router.post("/bootstrap", authMiddleware, bootstrapOrganization);
router.post("/invites", authMiddleware, createOrganisationInvite);
router.get("/invites", authMiddleware, getOrganisationInvite);
router.delete("/invites/:inviteId", authMiddleware, deleteOrganisationInvite);

export default router;
