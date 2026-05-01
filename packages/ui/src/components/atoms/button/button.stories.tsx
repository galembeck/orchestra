import type { Meta, StoryObj } from "@storybook/react-vite";
import { Star, Sun } from "lucide-react";
import { Button } from "./button";

const meta = {
	title: "Atoms/Button",
	component: Button,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A versatile button with three visual variants (`primary`, `secondary`, `accent`) and four sizes (`default`, `sm`, `lg`, `icon`). Built with `tailwind-variants`; supports disabled state via the `data-disabled` attribute.",
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
		size: {
			control: "select",
			options: ["default", "sm", "lg", "icon"],
			description:
				"Controls padding and dimensions. Use `icon` for square icon-only buttons.",
			table: {
				defaultValue: { summary: "default" },
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

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-end gap-4">
			<Button size="sm">Small</Button>
			<Button size="default">Default</Button>
			<Button size="lg">Large</Button>
			<Button size="icon" variant="secondary">
				<Sun />
			</Button>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"All size variants. `icon` removes all padding and sets a fixed square dimension — ideal for toolbar toggles.",
			},
		},
	},
};
