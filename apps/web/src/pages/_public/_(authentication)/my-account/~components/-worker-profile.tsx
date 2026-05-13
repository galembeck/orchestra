import type { PublicUserDTO } from "@repo/core/models/user.model";
import { WorkerHeaderCard } from "./worker-profile/-worker-header-card";
import { WorkerStatsRow } from "./worker-profile/-worker-stats-row";
import { WorkerTabs } from "./worker-profile/-worker-tabs";
import { WorkerUpcomingAppointments } from "./worker-profile/-worker-upcoming-appointments";

interface WorkerProfileProps {
	user: PublicUserDTO;
}

export function WorkerProfile({ user }: WorkerProfileProps) {
	return (
		<div className="flex flex-col gap-8">
			<WorkerHeaderCard user={user} />
			<WorkerStatsRow />
			<WorkerTabs />
			<WorkerUpcomingAppointments />
		</div>
	);
}
