import { defineConfig } from "@cerios/openapi-to-zod";

export default defineConfig({
	defaults: {
		mode: "strict",
		includeDescriptions: true,
		showStats: false,
	},
	specs: [
		{
			input: "openapi.yaml",
			outputTypes: "src/generated/zod.ts",
		},
	],
});
