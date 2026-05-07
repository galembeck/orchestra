import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon } from "lucide-react";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "./avatar";

const meta = {
	title: "Molecules/Avatar",
	component: Avatar,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A circular user avatar with image, fallback initials, optional badge indicator, and group stacking. Three sizes — `sm`, `default`, and `lg` — are controlled via a `data-size` attribute so nested sub-components scale automatically.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "inline-radio",
			options: ["sm", "default", "lg"],
			description: "Controls the diameter of the avatar and scales badge/text",
			table: { defaultValue: { summary: "default" } },
		},
	},
	args: { size: "default" },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
	render: (args) => (
		<Avatar {...args}>
			<AvatarImage alt="Pedro Galembeck" src="https://github.com/shadcn.png" />
			<AvatarFallback>PG</AvatarFallback>
		</Avatar>
	),
};

export const Fallback: Story = {
	render: (args) => (
		<Avatar {...args}>
			<AvatarImage alt="Broken" src="/does-not-exist.png" />
			<AvatarFallback>PG</AvatarFallback>
		</Avatar>
	),
	parameters: {
		docs: {
			description: {
				story:
					"When the image fails to load, `AvatarFallback` renders initials on a muted background.",
			},
		},
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar size="sm">
				<AvatarFallback>SM</AvatarFallback>
			</Avatar>
			<Avatar size="default">
				<AvatarFallback>MD</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback>LG</AvatarFallback>
			</Avatar>
		</div>
	),
	parameters: {
		docs: {
			description: { story: "All three size variants side by side." },
		},
	},
};

export const WithBadge: Story = {
	render: () => (
		<div className="flex items-center gap-6">
			<Avatar size="sm">
				<AvatarFallback>SM</AvatarFallback>
				<AvatarBadge />
			</Avatar>
			<Avatar size="default">
				<AvatarFallback>MD</AvatarFallback>
				<AvatarBadge>
					<CheckIcon />
				</AvatarBadge>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback>LG</AvatarFallback>
				<AvatarBadge>
					<CheckIcon />
				</AvatarBadge>
			</Avatar>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`AvatarBadge` renders a small indicator in the bottom-right corner. Pass an icon child for the `default`/`lg` sizes.",
			},
		},
	},
};

export const Group: Story = {
	render: () => (
		<AvatarGroup>
			{["A", "B", "C", "D"].map((init) => (
				<Avatar key={init}>
					<AvatarFallback>{init}</AvatarFallback>
				</Avatar>
			))}
			<AvatarGroupCount className="text-xs">+5</AvatarGroupCount>
		</AvatarGroup>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`AvatarGroup` stacks avatars with a negative margin. Use `AvatarGroupCount` to indicate overflow.",
			},
		},
	},
};
