import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./footer";

const meta = {
	title: "Organisms/Footer",
	component: Footer,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Site footer with logo, tagline, nav columns (PRODUTO, EMPRESA, SUPORTE), copyright line, and social links. Uses `bg-surface-navy` with `text-foreground-inverse` tokens — always dark regardless of theme.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
