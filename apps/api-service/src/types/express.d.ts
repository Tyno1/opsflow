import type { EntraIdClaims } from "@/services/auth/session.js";

declare global {
	namespace Express {
		interface Request {
			auth?: EntraIdClaims;
		}
	}
}
