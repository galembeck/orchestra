import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarIcon, FileIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../atoms/button/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "./command";

const meta = {
	title: "Molecules/Command",
	component: Command,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A searchable command palette built on `cmdk`. Renders a fuzzy-search input with grouped, keyboard-navigable items. Can be embedded inline or wrapped in `CommandDialog` for a modal overlay.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Inline: Story = {
	render: () => (
		<Command className="w-80 rounded-lg border border-border shadow-sm">
			<CommandInput placeholder="Search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Pages">
					<CommandItem>
						<FileIcon />
						Dashboard
						<CommandShortcut>⌘D</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<CalendarIcon />
						Schedule
						<CommandShortcut>⌘S</CommandShortcut>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Account">
					<CommandItem>
						<UserIcon />
						Profile
					</CommandItem>
					<CommandItem>
						<SettingsIcon />
						Settings
						<CommandShortcut>⌘,</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	),
	parameters: {
		docs: {
			description: {
				story: "Embedded command palette — useful inside popovers or sidebars.",
			},
		},
	},
};

export const WithDialog: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<>
				<Button onClick={() => setOpen(true)} variant="secondary">
					Open Command Palette
					<CommandShortcut className="ml-2">⌘K</CommandShortcut>
				</Button>
				<CommandDialog onOpenChange={setOpen} open={open}>
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup heading="Suggestions">
							<CommandItem>
								<CalendarIcon />
								Schedule a service
							</CommandItem>
							<CommandItem>
								<UserIcon />
								View technicians
							</CommandItem>
							<CommandItem>
								<FileIcon />
								New report
							</CommandItem>
						</CommandGroup>
						<CommandSeparator />
						<CommandGroup heading="Settings">
							<CommandItem>
								<SettingsIcon />
								Preferences
								<CommandShortcut>⌘,</CommandShortcut>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			</>
		);
	},
	parameters: {
		docs: {
			description: {
				story:
					"`CommandDialog` wraps the palette in a modal overlay — open it with a button or a keyboard shortcut.",
			},
		},
	},
};
