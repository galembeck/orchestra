import type { PublicUserDTO } from "@repo/core/models/user.model";
import { CompanyHeaderCard } from "./company-profile/-company-header-card";
import { CompanyIncomingOrders } from "./company-profile/-company-incoming-orders";
import { CompanyStatsRow } from "./company-profile/-company-stats-row";
import { CompanyTabs } from "./company-profile/-company-tabs";

interface CompanyProfileProps {
	user: PublicUserDTO;
}

export function CompanyProfile({ user }: CompanyProfileProps) {
	return (
		<div className="flex flex-col gap-8">
			<CompanyHeaderCard user={user} />
			<CompanyStatsRow />
			<CompanyTabs />
			<CompanyIncomingOrders />
		</div>
	);
}
