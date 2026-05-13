import { BREADCRUMB_LABELS } from "@/constants/_app/company/breadcrumb-labels";

interface Crumb {
	href: string;
	label: string;
}

export function buildBreadcrumbs(
	pathname: string,
	companySlug: string
): Crumb[] {
	const segments = pathname.split("/").filter(Boolean);
	const crumbs: Crumb[] = [];

	let acc = "";
	for (const segment of segments) {
		acc += `/${segment}`;

		if (segment === "app") {
			continue;
		}

		if (segment === companySlug) {
			crumbs.push({ href: acc, label: BREADCRUMB_LABELS.overview });
			continue;
		}

		const label = BREADCRUMB_LABELS[segment];
		if (!label) {
			continue;
		}

		crumbs.push({ href: acc, label });
	}

	return crumbs;
}
