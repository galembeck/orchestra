/// <reference types="vite/client" />
import type { Decorator, Preview } from "@storybook/react-vite";
import "./storybook.css";

const withTheme: Decorator = (Story, context) => {
	document.documentElement.classList.toggle(
		"dark",
		context.globals.theme === "dark"
	);
	return Story();
};

const preview: Preview = {
	decorators: [withTheme],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: "centered",
		backgrounds: { disable: true },
		a11y: {
			test: "todo",
		},
	},
	globalTypes: {
		theme: {
			description: "Global color theme",
			toolbar: {
				title: "Theme",
				icon: "paintbrush",
				items: [
					{ value: "light", title: "Light", icon: "sun" },
					{ value: "dark", title: "Dark", icon: "moon" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: "light",
	},
};

export default preview;
