import { scrollToSection } from "@repo/core/utils/scroll-to-section";
import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

export function useGlobalHashScroll() {
	const location = useLocation();

	useEffect(() => {
		if (location.hash) {
			setTimeout(() => {
				scrollToSection(location.hash);
			}, 100);
		}
	}, [location.hash]);
}
