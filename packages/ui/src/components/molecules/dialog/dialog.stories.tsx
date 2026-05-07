import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

const meta = {
	title: "Molecules/Dialog",
	component: Dialog,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A modal overlay built on Radix UI's Dialog primitive. Composed of `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, and `DialogFooter`. The close button can be hidden via `showCloseButton={false}`.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="secondary">Open Dialog</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm action</DialogTitle>
					<DialogDescription>
						Are you sure you want to proceed? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	),
};

export const WithFooter: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="primary">Schedule Service</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Service Request</DialogTitle>
					<DialogDescription>
						Fill in the details below to create a new service request for your
						team.
					</DialogDescription>
				</DialogHeader>
				<div className="rounded-md border border-border p-3 text-foreground-secondary text-sm">
					Form fields would go here.
				</div>
				<DialogFooter>
					<Button variant="secondary">Cancel</Button>
					<Button variant="primary">Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
	parameters: {
		docs: {
			description: {
				story:
					"`DialogFooter` renders action buttons at the bottom separated from the body.",
			},
		},
	},
};

export const WithCloseInFooter: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="secondary">Open</Button>
			</DialogTrigger>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Terms of Service</DialogTitle>
					<DialogDescription>
						Please read and accept the terms to continue.
					</DialogDescription>
				</DialogHeader>
				<p className="text-foreground-secondary text-sm leading-relaxed">
					By using Orchestra you agree to our terms of service and privacy
					policy.
				</p>
				<DialogFooter showCloseButton>
					<Button variant="primary">Accept</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Corner close button hidden via `showCloseButton={false}` on `DialogContent`; a close button is rendered in the footer instead via `showCloseButton` on `DialogFooter`.",
			},
		},
	},
};

export const Destructive: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="secondary">Delete Account</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete account</DialogTitle>
					<DialogDescription>
						This will permanently delete your account and all associated data.
						You cannot undo this.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="secondary">Cancel</Button>
					<Button variant="primary">Delete permanently</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
	parameters: {
		docs: {
			description: {
				story: "Destructive confirmation dialog pattern.",
			},
		},
	},
};
