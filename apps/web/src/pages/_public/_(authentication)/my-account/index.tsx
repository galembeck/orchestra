import { useAuth } from "@repo/core/hooks/services/use-auth";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@repo/ui/components/molecules/breadcrumb/breadcrumb";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PUBLIC_BREADCRUMB_LABELS } from "@/constants/_public/breadcrumb-labels";
import { ProfileInformationCard } from "./~components/-profile-information-card";

export const Route = createFileRoute("/_public/_(authentication)/my-account/")({
	component: AccountPage,
	head: () => ({
		meta: [{ title: "Minha conta | orchestra.web" }],
	}),
});

function AccountPage() {
	const { user } = useAuth();

	if (!user) {
		return null;
	}

	return (
		<main className="flex flex-col px-5 lg:px-20">
			<header className="py-4">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									className="font-jetbrains-mono text-foreground-tertiary text-xs"
									to="/"
								>
									{PUBLIC_BREADCRUMB_LABELS.home}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbSeparator />

						<BreadcrumbItem>
							<BreadcrumbPage className="font-jetbrains-mono text-foreground-primary text-xs">
								{PUBLIC_BREADCRUMB_LABELS["my-account"]}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</header>

			<div className="pt-5 pb-8">
				<ProfileInformationCard user={user} />
			</div>
		</main>
	);
}
