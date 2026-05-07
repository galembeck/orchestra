import { Badge } from "@repo/ui/components/atoms/badge/badge";
import {
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "@repo/ui/components/organisms/sidebar/sidebar";
import { Link } from "@tanstack/react-router";
import { AudioWaveform } from "lucide-react";

export function OrchestraHeader() {
	const { state } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem className="flex items-center justify-between px-2 py-4">
				<Link
					className="flex items-center gap-2.5 text-foreground-inverse"
					to="/"
				>
					<AudioWaveform
						className={`${state === "collapsed" ? "h-5 w-5" : "h-7 w-7"}`}
					/>

					<h1 className="font-instrument-serif font-medium text-2xl group-data-[collapsible=icon]:hidden">
						Orchestra
					</h1>
				</Link>

				<Badge
					className={`border-2! border-foreground-inverse font-bold text-[10px] text-foreground-inverse uppercase ${state === "collapsed" ? "hidden" : "block"}`}
					variant="outline"
				>
					Dashboard
				</Badge>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
