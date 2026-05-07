import {
	ScrollArea,
	ScrollBar,
} from "@repo/ui/components/atoms/scroll-area/scroll-area";
import { Wrench } from "lucide-react";
import { ServicesListingCard } from "./-services-listing-card";

export function ServicesListing() {
	return (
		<div className="h-full w-full min-w-0 shrink-0 border-border border-r lg:w-[600px]">
			<ScrollArea className="h-full">
				<div className="flex flex-col gap-4 px-5 py-3.5 lg:px-20">
					<ServicesListingCard
						category="Hidráulica"
						companyName="HidroFix Reparos"
						distance="1.2"
						estimatedTime="14"
						icon={Wrench}
						neighborhood="Pinheiros"
						price="120"
						reviews={{ rating: 4.9, counter: "312" }}
						serviceType="Encanamento"
					/>

					<ServicesListingCard
						category="Hidráulica"
						companyName="HidroFix Reparos"
						distance="1.2"
						estimatedTime="14"
						icon={Wrench}
						neighborhood="Pinheiros"
						price="120"
						reviews={{ rating: 4.9, counter: "312" }}
						serviceType="Encanamento"
					/>

					<ServicesListingCard
						category="Hidráulica"
						companyName="HidroFix Reparos"
						distance="1.2"
						estimatedTime="14"
						icon={Wrench}
						neighborhood="Pinheiros"
						price="120"
						reviews={{ rating: 4.9, counter: "312" }}
						serviceType="Encanamento"
					/>

					<ServicesListingCard
						category="Hidráulica"
						companyName="HidroFix Reparos"
						distance="1.2"
						estimatedTime="14"
						icon={Wrench}
						neighborhood="Pinheiros"
						price="120"
						reviews={{ rating: 4.9, counter: "312" }}
						serviceType="Encanamento"
					/>

					<ServicesListingCard
						category="Hidráulica"
						companyName="HidroFix Reparos"
						distance="1.2"
						estimatedTime="14"
						icon={Wrench}
						neighborhood="Pinheiros"
						price="120"
						reviews={{ rating: 4.9, counter: "312" }}
						serviceType="Encanamento"
					/>

					<ServicesListingCard
						category="Hidráulica"
						companyName="HidroFix Reparos"
						distance="1.2"
						estimatedTime="14"
						icon={Wrench}
						neighborhood="Pinheiros"
						price="120"
						reviews={{ rating: 4.9, counter: "312" }}
						serviceType="Encanamento"
					/>
				</div>

				<ScrollBar className="hidden" />
			</ScrollArea>
		</div>
	);
}
