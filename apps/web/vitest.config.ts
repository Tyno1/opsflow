import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = import.meta.dirname;

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: false,
		setupFiles: ["./vitest.setup.ts"],
		include: ["**/*.{test,spec}.{ts,tsx}"],
		exclude: ["node_modules", ".next", "dist"],
		css: false,
	},
	resolve: {
		alias: [
			{
				find: "@/components",
				replacement: path.resolve(root, "./app/components"),
			},
			{
				find: "@",
				replacement: path.resolve(root, "./"),
			},
		],
	},
});
