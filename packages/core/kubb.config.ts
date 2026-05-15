import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig({
	root: ".",
	input: {
		path: "http://localhost:5005/openapi/json",
	},
	output: {
		path: "./src/generated",
		clean: true,
	},
	plugins: [
		pluginOas({ output: false }),
		pluginTs({
			output: { path: "types" },
		}),
		pluginReactQuery({
			output: { path: "hooks" },
			group: {
				type: "tag",
				name: ({ group }) => `use-${group.toLowerCase()}`,
			},
			mutation: {
				methods: ["post", "put", "patch", "delete"],
			},
		}),
	],
});
