import { AudioWaveform } from "lucide-react";

export function Logo() {
	return (
		<div className="flex items-center gap-2.5">
			<AudioWaveform className="h-7 w-7 text-foreground-primary" />

			<h1 className="font-instrument-serif font-medium text-2xl text-foreground-primary">
				Orchestra
			</h1>
		</div>
	);
}
