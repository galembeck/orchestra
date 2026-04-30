import type { Meta, StoryObj } from "@storybook/react-vite";
import { Star } from "lucide-react";
import { Button } from "./button";

const meta = {
	title: "Atoms/Button",
	component: Button,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A versatile button with three visual variants: `primary`, `secondary`, and `accent`. Built with `tailwind-variants` for consistent styling and supports disabled state via the `data-disabled` attribute.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "accent"],
			description: "The visual style variant of the button",
			table: {
				defaultValue: { summary: "primary" },
			},
		},
		disabled: {
			control: "boolean",
			description:
				"Disables the button, preventing interaction and reducing opacity",
		},
		children: {
			control: "text",
			description: "Content rendered inside the button",
		},
	},
	args: {
		children: "Button",
		disabled: false,
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: "primary",
		children: "Get Started",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Learn More",
	},
};

export const Accent: Story = {
	render: () => (
		<Button variant="accent">
			<Star />
			Upgrade Plan
		</Button>
	),
};

export const Disabled: Story = {
	args: {
		variant: "primary",
		children: "Unavailable",
		disabled: true,
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="accent">
				<Star />
				Accent
			</Button>
			<Button variant="primary" disabled>
				Disabled
			</Button>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "All available button variants side by side.",
			},
		},
	},
};
