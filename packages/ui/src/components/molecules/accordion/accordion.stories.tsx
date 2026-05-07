import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./accordion";

const meta = {
	title: "Molecules/Accordion",
	component: Accordion,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Collapsible sections built on Radix UI's Accordion primitive. Supports `single` (only one open at a time) and `multiple` (many can be open) types. Uses animated chevron icons to indicate expand/collapse state.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "inline-radio",
			options: ["single", "multiple"],
			description:
				"`single` closes the currently open item when another opens; `multiple` allows many items open simultaneously",
			table: { defaultValue: { summary: "single" } },
		},
	},
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const faqItems = [
	{
		value: "item-1",
		trigger: "What is Orchestra?",
		content:
			"Orchestra is an all-in-one platform for managing field service operations — scheduling, dispatch, real-time tracking, and invoicing in one place.",
	},
	{
		value: "item-2",
		trigger: "How does billing work?",
		content:
			"You are billed monthly based on the number of active technicians on your account. Annual plans are available with a 20% discount.",
	},
	{
		value: "item-3",
		trigger: "Can I cancel at any time?",
		content:
			"Yes. You can cancel your subscription at any time from the account settings page. Your data is retained for 30 days after cancellation.",
	},
];

export const Single: Story = {
	args: { type: "single" },
	render: () => (
		<Accordion className="w-96" collapsible type="single">
			{faqItems.map(({ value, trigger, content }) => (
				<AccordionItem key={value} value={value}>
					<AccordionTrigger>{trigger}</AccordionTrigger>
					<AccordionContent>{content}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	),
	parameters: {
		docs: {
			description: {
				story:
					'`type="single"` with `collapsible` — opens one at a time and clicking the open item closes it.',
			},
		},
	},
};

export const Multiple: Story = {
	args: { type: "multiple" },
	render: () => (
		<Accordion className="w-96" type="multiple">
			{faqItems.map(({ value, trigger, content }) => (
				<AccordionItem key={value} value={value}>
					<AccordionTrigger>{trigger}</AccordionTrigger>
					<AccordionContent>{content}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	),
	parameters: {
		docs: {
			description: {
				story: '`type="multiple"` — any number of items can be open at once.',
			},
		},
	},
};

export const DefaultOpen: Story = {
	args: { type: "single" },
	render: () => (
		<Accordion className="w-96" collapsible defaultValue="item-1" type="single">
			{faqItems.map(({ value, trigger, content }) => (
				<AccordionItem key={value} value={value}>
					<AccordionTrigger>{trigger}</AccordionTrigger>
					<AccordionContent>{content}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	),
	parameters: {
		docs: {
			description: {
				story: "The first item is open by default via `defaultValue`.",
			},
		},
	},
};
