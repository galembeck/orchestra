import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton";

const meta = {
	title: "Atoms/Skeleton",
	component: Skeleton,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A pulsing placeholder block that communicates loading state. Accepts any `className` to set dimensions, border-radius, or shape — compose multiples to approximate the layout of real content.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		className: {
			control: "text",
			description: "Classes to control size and shape of the skeleton block",
		},
	},
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Skeleton className="h-4 w-48" />,
};

export const Circle: Story = {
	render: () => <Skeleton className="size-10 rounded-full" />,
	parameters: {
		docs: {
			description: {
				story: "Round skeleton for avatar placeholders.",
			},
		},
	},
};

export const CardSkeleton: Story = {
	render: () => (
		<div className="flex w-72 flex-col gap-3 rounded-lg border border-border p-4">
			<div className="flex items-center gap-3">
				<Skeleton className="size-10 rounded-full" />
				<div className="flex flex-col gap-1.5">
					<Skeleton className="h-3.5 w-32" />
					<Skeleton className="h-3 w-20" />
				</div>
			</div>
			<Skeleton className="h-3 w-full" />
			<Skeleton className="h-3 w-5/6" />
			<Skeleton className="h-3 w-4/6" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Compose multiple skeletons to approximate a card with avatar, title, and body text.",
			},
		},
	},
};

export const ListSkeleton: Story = {
	render: () => (
		<div className="flex w-64 flex-col gap-3">
			{Array.from({ length: 5 }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: not important for story files
				<div className="flex items-center gap-3" key={i}>
					<Skeleton className="size-8 rounded-md" />
					<div className="flex flex-1 flex-col gap-1.5">
						<Skeleton className="h-3 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				</div>
			))}
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Row-based skeleton list for sidebar nav or search results.",
			},
		},
	},
};
