import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(express.json());

app.get("/v1/health", (_req, res) => {
	res.json({ status: "ok" satisfies "ok" });
});

app.listen(port, () => {
	console.log(`Backend listening on http://localhost:${port}`);
});
