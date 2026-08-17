import type { Response } from "express";
import { errors as joseErrors } from "jose";
import { logger } from "@/helpers/pino-logger.js";

export type ApiErrorDefinition = {
	status: number;
	message: string;
	code?: string;
};

export class ApiError extends Error {
	readonly status: number;
	readonly code?: string;

	constructor(status: number, message: string);
	constructor(def: ApiErrorDefinition);
	constructor(statusOrDef: number | ApiErrorDefinition, message?: string) {
		if (typeof statusOrDef === "object") {
			super(statusOrDef.message);
			this.status = statusOrDef.status;
			this.code = statusOrDef.code;
		} else {
			super(message ?? "");
			this.status = statusOrDef;
		}

		this.name = "ApiError";
	}

	toJSON() {
		return this.code
			? { code: this.code, message: this.message }
			: { message: this.message };
	}
}

export function apiError(status: number, message: string): ApiError;
export function apiError(def: ApiErrorDefinition): ApiError;
export function apiError(
	statusOrDef: number | ApiErrorDefinition,
	message?: string,
): ApiError {
	if (typeof statusOrDef === "object") {
		return new ApiError(statusOrDef);
	}

	return new ApiError(statusOrDef, message ?? "");
}

export function sendApiError(
	res: Response,
	error: unknown,
	logContext?: string,
): void {
	if (error instanceof ApiError) {
		res.status(error.status).json(error.toJSON());
		return;
	}

	if (error instanceof joseErrors.JOSEError) {
		res.status(401).json({ message: "Invalid or expired token" });
		return;
	}

	logger.error({ err: error }, logContext ?? "Unhandled error");

	res.status(500).json({ message: "Internal server error" });
}
