// biome-ignore lint/suspicious/noShadowRestrictedNames: required by @mapcn
import { Map } from "@repo/ui/components/organisms/map/map";

export function ServicesMap() {
	return (
		<div className="flex h-full flex-1">
			<Map center={[-74.006, 40.7128]} zoom={12} />
		</div>
	);
}
