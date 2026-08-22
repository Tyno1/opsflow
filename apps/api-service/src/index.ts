import "dotenv/config";
import cors from "cors";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { httpLogger, logger } from "./helpers/pino-logger.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { sendApiError } from "./utils/apiError.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [];
const corsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, origin?: string) => void,
	) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, origin);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};

app.use(express.json());
app.use(httpLogger);
app.use(cors(corsOptions));
app.use("/v1", sessionRoutes);
app.use("/v1/organizations", organizationRoutes);

app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) {
		next(err);
		return;
	}

	sendApiError(res, err);
});

app.get("/v1/health", (_req, res) => {
	res.json({ status: "ok" satisfies "ok" });
});

app.listen(port, () => {
	logger.info(`Backend listening on http://localhost:${port}`);
});
