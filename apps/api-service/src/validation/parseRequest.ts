import type { Response } from "express";
import type { z } from "zod";
import { apiError } from "@/utils/apiError.js";

function formatZodError(error: z.ZodError): string {
	return error.issues.map((issue) => issue.message).join("; ");
}

export function parseBody<T extends z.ZodType>(
	schema: T,
	body: unknown,
): z.infer<T> {
	const result = schema.safeParse(body);
	if (!result.success) {
		throw apiError(400, formatZodError(result.error));
	}

	return result.data;
}

export function parseQuery<T extends z.ZodType>(
	schema: T,
	query: unknown,
): z.infer<T> {
	const result = schema.safeParse(query);
	if (!result.success) {
		throw apiError(400, formatZodError(result.error));
	}

	return result.data;
}

export function sendJson<T extends z.ZodType>(
	res: Response,
	status: number,
	schema: T,
	data: unknown,
): void {
	res.status(status).json(schema.parse(data));
}
