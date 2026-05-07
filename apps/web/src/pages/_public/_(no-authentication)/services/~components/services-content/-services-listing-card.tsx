import { Clock, type LucideIcon, MapPin, Star } from "lucide-react";

interface ServicesListingCardProps {
	category: string;
	companyName: string;
	distance: string;
	estimatedTime: string;
	icon: LucideIcon;
	neighborhood: string;
	price: string;
	reviews: {
		rating: number;
		counter: string;
	};
	serviceType: string;
}

export function ServicesListingCard({
	icon: Icon,
	companyName,
	serviceType,
	category,
	reviews,
	distance,
	neighborhood,
	estimatedTime,
	price,
}: ServicesListingCardProps) {
	return (
		<div className="flex min-w-[500px] gap-4 rounded-[14px] border border-border bg-surface-raised p-4.5">
			<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-surface">
				<Icon className="h-7 w-7 text-foreground-primary" />
			</div>

			<article className="flex flex-1 flex-col gap-2">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-col">
						<h3 className="font-inter font-semibold text-base text-foreground-primary leading-tight">
							{companyName}
						</h3>
						<p className="font-inter text-[13px] text-foreground-tertiary">
							{serviceType} · {category}
						</p>
					</div>

					<div className="flex shrink-0 items-center gap-1.5 font-jetbrains-mono font-semibold text-[13px] text-foreground-primary">
						<Star className="h-3.5 w-3.5 fill-foreground-primary text-foreground-primary" />{" "}
						{reviews.rating}{" "}
						<span className="font-jetbrains-mono font-normal text-foreground-tertiary text-xs">
							({reviews.counter})
						</span>
					</div>
				</div>

				<div className="flex items-center gap-3 font-jetbrains-mono text-[12px] text-foreground-tertiary">
					<div className="flex items-center gap-1">
						<MapPin className="h-3.5 w-3.5" />
						{distance} km
					</div>
					<span>·</span>
					<span>{neighborhood}</span>
					<span>·</span>
					<div className="flex items-center gap-1">
						<Clock className="h-3.5 w-3.5" />~{estimatedTime} min
					</div>
				</div>

				<div className="flex items-center justify-end gap-2">
					<p className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-wider">
						A partir de
					</p>
					<span className="font-bold font-inter text-base text-foreground-primary">
						R$ {price}
					</span>
				</div>
			</article>
		</div>
	);
}
