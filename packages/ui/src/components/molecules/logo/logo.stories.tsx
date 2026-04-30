import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo } from "./logo";

const meta = {
	title: "Molecules/Logo",
	component: Logo,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"The Orchestra brand mark combining an `AudioWaveform` icon and wordmark. Renders using the `font-instrument-serif` typeface and `foreground-primary` color token.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
