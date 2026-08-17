import express from "express";
import { bootstrapOrganization } from "../controllers/organizationBootstrapController.js";

const router = express.Router();

router.post("/organizations/bootstrap", bootstrapOrganization);

export default router;
