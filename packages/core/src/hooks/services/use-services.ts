import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateServiceDTO } from "../../models/service.model.js";
import { serviceService } from "../../services/service.service.js";

export function useServices() {
	return useQuery({
		queryKey: ["services"],
		queryFn: serviceService.list,
	});
}

export function useService(serviceId: string | undefined) {
	return useQuery({
		queryKey: ["services", serviceId],
		queryFn: () => serviceService.getById(serviceId as string),
		enabled: !!serviceId,
	});
}

export function useCompanyServices(companyId: string | undefined) {
	return useQuery({
		queryKey: ["services", "company", companyId],
		queryFn: () => serviceService.listByCompany(companyId as string),
		enabled: !!companyId,
	});
}

export function useServiceCategories() {
	return useQuery({
		queryKey: ["service-categories"],
		queryFn: serviceService.listCategories,
		staleTime: 1000 * 60 * 10,
	});
}

export function useCreateService(companyId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateServiceDTO) =>
			serviceService.create(companyId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["services", "company", companyId],
			});
			queryClient.invalidateQueries({ queryKey: ["services"] });

			toast.success("Serviço cadastrado!");
		},

		onError: (err) =>
			toast.error("Erro ao cadastrar serviço.", { description: err.message }),
	});
}
