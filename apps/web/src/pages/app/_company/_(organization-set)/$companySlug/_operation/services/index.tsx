import { useMyCompanies } from "@repo/core/hooks/services/use-company";
import { useCompanyServices } from "@repo/core/hooks/services/use-services";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/molecules/table/table";
import { createFileRoute } from "@tanstack/react-router";
import { CreateServiceDialog } from "./~components/-create-service-dialog";
import { ServiceTableRow } from "./~components/-service-table-row";

export const Route = createFileRoute(
	"/app/_company/_(organization-set)/$companySlug/_operation/services/"
)({
	component: ServicesManagementPage,
	head: () => ({
		meta: [
			{
				title: "Serviços oferecidos | ochestra.web",
			},
		],
	}),
});

function ServicesManagementPage() {
	const { companySlug } = Route.useParams();
	const { data: companies } = useMyCompanies();
	const company = companies?.find((c) => c.slug === companySlug);

	const { data: services, isLoading } = useCompanyServices(company?.id);

	if (!company) {
		return null;
	}

	return (
		<main className="flex flex-col gap-5">
			<header className="flex items-center justify-between gap-4">
				<div className="flex flex-col gap-2">
					<span className="font-jetbrains-mono font-medium text-[11px] text-foreground-tertiary uppercase tracking-[1.5px]">
						Catálogo
					</span>

					<h1 className="font-instrument-serif text-3xl text-foreground-primary">
						Serviços oferecidos
					</h1>

					<p className="font-inter text-[13px] text-foreground-tertiary">
						Cadastre e visualize os serviços que sua empresa/companhia oferece e
						que estarão disponíveis aos usuários em nossa plataforma.
					</p>
				</div>

				<CreateServiceDialog company={company} />
			</header>

			<section className="overflow-hidden rounded-[14px] border border-border bg-surface-paper-soft">
				{isLoading && (
					<div className="p-6 font-jetbrains-mono text-foreground-tertiary text-xs">
						Carregando serviços...
					</div>
				)}

				{!isLoading && services && services.length === 0 && (
					<div className="flex flex-col items-center gap-2 p-10 text-center">
						<h2 className="font-instrument-serif text-foreground-primary text-xl">
							Nenhum serviço cadastrado ainda :/
						</h2>

						<p className="font-inter text-foreground-tertiary text-sm">
							Cadastre o primeiro serviço para começar a aparecer nas buscas.
						</p>
					</div>
				)}

				{services && services.length > 0 && (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Categoria</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Cidade</TableHead>
								<TableHead className="text-right">Preço</TableHead>
								<TableHead className="text-right">Avaliação</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{services.map((service) => (
								<ServiceTableRow key={service.id} service={service} />
							))}
						</TableBody>
					</Table>
				)}
			</section>
		</main>
	);
}
