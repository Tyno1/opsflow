import type { EntraIdClaims } from "@/services/SessionService.js";

declare global {
	namespace Express {
		interface Request {
			auth?: EntraIdClaims;
		}
	}
}
