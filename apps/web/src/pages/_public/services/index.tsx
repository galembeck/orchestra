import { createFileRoute } from "@tanstack/react-router";
import { ServicesListing } from "./~components/services-content/-services-listing";
import { ServicesMap } from "./~components/services-content/-services-map";
import { SearchHeader } from "./~components/services-header/-search-header";

export const Route = createFileRoute("/_public/services/")({
	component: ServicesPage,
});

function ServicesPage() {
	return (
		<main className="flex h-screen flex-col overflow-hidden">
			<SearchHeader />

			<div className="flex min-h-0 flex-1 flex-row">
				<ServicesListing />

				<ServicesMap />
			</div>
		</main>
	);
}
