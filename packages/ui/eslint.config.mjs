import storybook from "eslint-plugin-storybook";

// biome-ignore lint/style/noExportedImports: required by @Biome.js
import { config } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config[]} */
export default [
	...config,
	...storybook.configs["flat/recommended"],
];
