import { createContext, useContext, type ComponentType } from "react";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { userEvent, within } from "storybook/test";
import { Navbar } from "./navbar";

// A stable context so we can swap the rendered story without creating a new
// component type on every decorator call (which would break React's hook rules).
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

const withRouter: Decorator = (Story) => {
	return (
		<StoryRendererContext.Provider value={Story as ComponentType}>
			<RouterProvider router={router} />
		</StoryRendererContext.Provider>
	);
};

const meta = {
	title: "Organisms/Navbar",
	component: Navbar,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Responsive navigation bar with a hamburger menu on mobile (< `lg`) and a full horizontal nav on desktop. Uses `@tanstack/react-router` `Link` for active-state highlighting.",
			},
		},
	},
	tags: ["autodocs"],
	decorators: [withRouter],
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
	parameters: {
		viewport: { defaultViewport: "desktop" },
		docs: {
			description: { story: "Full horizontal navigation at desktop width." },
		},
	},
};

export const Mobile: Story = {
	parameters: {
		viewport: { defaultViewport: "mobile1" },
		docs: {
			description: { story: "Collapsed hamburger menu at mobile width." },
		},
	},
};

export const MobileMenuOpen: Story = {
	parameters: {
		viewport: { defaultViewport: "mobile1" },
		docs: {
			description: {
				story: "Mobile navigation with the menu expanded via the hamburger toggle.",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const menuButton = canvas.getByRole("button", { name: /abrir menu/i });
		await userEvent.click(menuButton);
	},
};
