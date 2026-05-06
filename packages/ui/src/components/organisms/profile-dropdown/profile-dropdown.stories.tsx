import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { LayoutDashboard, LogOut } from "lucide-react";
import { type ComponentType, createContext, useContext } from "react";
import { userEvent, within } from "storybook/test";
import { Badge } from "../../atoms/badge/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../molecules/dropdown-menu/dropdown-menu";

// ---------------------------------------------------------------------------
// Router setup (mirrors the pattern from navbar.stories.tsx)
// ProfileDropdown uses useNavigate internally, so it needs a router context.
// ---------------------------------------------------------------------------

const StoryRendererContext = createContext<ComponentType>(() => null);
const RouteComponent = () => {
	const Story = useContext(StoryRendererContext);
	return <Story />;
};
const rootRoute = createRootRoute({ component: RouteComponent });
const router = createRouter({
	routeTree: rootRoute,
	history: createMemoryHistory({ initialEntries: ["/"] }),
});

const withRouter: Decorator = (Story) => (
	<StoryRendererContext.Provider value={Story as ComponentType}>
		<RouterProvider router={router} />
	</StoryRendererContext.Provider>
);

// ---------------------------------------------------------------------------
// Static preview
// ProfileDropdown reads user data from useAuth (requires the full auth +
// react-query provider stack). Stories render a structurally identical
// component with injected props so the full visual appearance is testable
// without a live auth context.
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
	return name
		.split(" ")
		.slice(0, 2)
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}

interface ProfileDropdownPreviewProps {
	/** Full display name of the logged-in user. */
	userName: string;
}

function ProfileDropdownPreview({ userName }: ProfileDropdownPreviewProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					aria-label="Abrir menu do perfil"
					className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-foreground-primary font-semibold text-sm text-surface transition-colors hover:bg-primary-green/90"
					type="button"
				>
					{getInitials(userName)}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" className="w-56">
				<Badge />

				<DropdownMenuGroup>
					<DropdownMenuLabel>Painel administrativo</DropdownMenuLabel>

					<DropdownMenuGroup>
						<DropdownMenuItem>
							<LayoutDashboard />
							Dashboard
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="group hover:bg-red-100! focus:text-red-400">
					<LogOut className="group-focus:text-red-400" />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
	title: "Organisms/ProfileDropdown",
	component: ProfileDropdownPreview,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"User avatar button shown in the admin panel header. Displays the user's initials and opens a dropdown with quick-nav links and a sign-out action. In production the component is powered by `useAuth` (session data + sign-out mutation) and `useNavigate` for routing — stories use a static preview to isolate the visual behaviour.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		userName: {
			control: "text",
			description:
				"Full display name of the logged-in user. Initials are extracted from the first two words.",
			table: { defaultValue: { summary: "Pedro Galembeck" } },
		},
	},
	args: {
		userName: "Pedro Galembeck",
	},
	decorators: [withRouter],
} satisfies Meta<typeof ProfileDropdownPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Closed state — the avatar button shows the user's initials. Click to open the menu.",
			},
		},
	},
};

export const MenuOpen: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"Dropdown expanded via the avatar button, showing the admin navigation and sign-out action.",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole("button", {
			// biome-ignore lint/performance/useTopLevelRegex: not important
			name: /abrir menu do perfil/i,
		});
		await userEvent.click(trigger);
	},
};

export const SingleInitial: Story = {
	args: { userName: "Carlos" },
	parameters: {
		docs: {
			description: {
				story: "Single-word name — only one initial is extracted.",
			},
		},
	},
};

export const LongName: Story = {
	args: { userName: "Ana Paula de Souza Ferreira" },
	parameters: {
		docs: {
			description: {
				story:
					"Names with more than two words — only the first two are used to compute the two-letter initials.",
			},
		},
	},
};

export const AllVariants: Story = {
	render: () => (
		<div className="ui:flex ui:items-center ui:gap-4">
			<ProfileDropdownPreview userName="Pedro Galembeck" />
			<ProfileDropdownPreview userName="Carlos" />
			<ProfileDropdownPreview userName="Ana Paula de Souza" />
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					"Three avatar buttons with different name lengths, showing how initials are derived in each case.",
			},
		},
	},
};
