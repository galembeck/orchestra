import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./sheet";

const meta = {
	title: "Molecules/Sheet",
	component: Sheet,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A slide-in panel built on Radix UI's Dialog primitive. Supports four slide directions via the `side` prop: `right` (default), `left`, `top`, and `bottom`. Compose with `SheetHeader`, `SheetTitle`, `SheetDescription`, and `SheetFooter` to build full panel layouts.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

const SheetDemo = ({
	side,
}: {
	side?: "right" | "left" | "top" | "bottom";
}) => (
	<Sheet>
		<SheetTrigger asChild>
			<Button variant="secondary">Open {side ?? "right"}</Button>
		</SheetTrigger>
		<SheetContent side={side}>
			<SheetHeader>
				<SheetTitle>Service details</SheetTitle>
				<SheetDescription>
					View and edit the details for this service request.
				</SheetDescription>
			</SheetHeader>
			<div className="flex-1 px-4 py-2 text-foreground-secondary text-sm">
				Content area — forms, lists, or any other UI.
			</div>
			<SheetFooter>
				<Button className="w-full" variant="primary">
					Save changes
				</Button>
			</SheetFooter>
		</SheetContent>
	</Sheet>
);

export const Right: Story = {
	render: () => <SheetDemo side="right" />,
	parameters: {
		docs: {
			description: { story: "Default slide-in from the right edge." },
		},
	},
};

export const Left: Story = {
	render: () => <SheetDemo side="left" />,
	parameters: {
		docs: {
			description: { story: "Slide-in from the left edge." },
		},
	},
};

export const Top: Story = {
	render: () => <SheetDemo side="top" />,
	parameters: {
		docs: {
			description: {
				story: "Slide-in from the top edge — useful for banners.",
			},
		},
	},
};

export const Bottom: Story = {
	render: () => <SheetDemo side="bottom" />,
	parameters: {
		docs: {
			description: {
				story:
					"Slide-in from the bottom edge — natural fit for mobile action sheets.",
			},
		},
	},
};

export const AllSides: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			{(["right", "left", "top", "bottom"] as const).map((side) => (
				<SheetDemo key={side} side={side} />
			))}
		</div>
	),
	parameters: {
		docs: {
			description: { story: "All four `side` values rendered side by side." },
		},
	},
};
