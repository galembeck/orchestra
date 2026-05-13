import type { PublicUserDTO } from "@repo/core/models/user.model";
import { ClientHeaderCard } from "./client-profile/-client-header-card";
import { ClientRecentOrders } from "./client-profile/-client-recent-orders";
import { ClientStatsRow } from "./client-profile/-client-stats-row";
import { ClientTabs } from "./client-profile/-client-tabs";

interface ClientProfileProps {
	user: PublicUserDTO;
}

export function ClientProfile({ user }: ClientProfileProps) {
	return (
		<div className="flex flex-col gap-8">
			<ClientHeaderCard user={user} />
			<ClientStatsRow />
			<ClientTabs />
			<ClientRecentOrders />
		</div>
	);
}
