import { ThemeProvider } from "@repo/core/providers/theme-provider";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { ThemeToggle } from "./theme-toggle";

// ThemeToggle requires ThemeProvider context for useTheme().
const withThemeProvider: Decorator = (Story) => (
	<ThemeProvider defaultTheme="light" storageKey="storybook-theme">
		<Story />
	</ThemeProvider>
);

const meta = {
	title: "Atoms/ThemeToggle",
	component: ThemeToggle,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"An icon button that opens a dropdown to switch between **Claro** (light), **Escuro** (dark), and **Sistema** (system) themes. Manages the `dark` class on `<html>` via `ThemeProvider`. Requires `ThemeProvider` in the tree.",
			},
		},
	},
	tags: ["autodocs"],
	decorators: [withThemeProvider],
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Click the button to open the theme dropdown. Selecting an option updates the `dark` class on `<html>` and persists to `localStorage`.",
			},
		},
	},
};
