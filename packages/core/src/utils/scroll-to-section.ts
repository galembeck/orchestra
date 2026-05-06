export function scrollToSection(id: string) {
	const el = document.getElementById(id);
	if (el) {
		el.scrollIntoView({ behavior: "smooth" });
	}
}

export function handleSmoothScroll(
	e: React.MouseEvent<HTMLAnchorElement>,
	targetPath: string
) {
	const [route, hash] = targetPath.split("#");
	const currentPath = window.location.pathname;

	if (!hash) {
		return;
	}

	const isSamePage =
		!route || route === currentPath || (route === "/" && currentPath === "/");

	if (isSamePage) {
		e.preventDefault();
		scrollToSection(hash);

		window.history.pushState(null, "", `${route || currentPath}#${hash}`);
	}
}
