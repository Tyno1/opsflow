import swaggerDocument from "@repo/dtos/openapi.yaml";
import express from "express";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use("/docs", swaggerUi.serve);
app.get("/docs", swaggerUi.setup(swaggerDocument));
app.get("/", (_req, res) => {
	res.redirect("/docs");
});

app.listen(port, () => {
	console.log(`Swagger docs are running on http://localhost:${port}/docs`);
});
