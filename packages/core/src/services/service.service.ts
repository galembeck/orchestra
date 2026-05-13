import { API } from "../api/connection/api.js";
import type {
	CreateServiceDTO,
	ServiceCategoryDTO,
	ServiceDTO,
} from "../models/service.model.js";

export const serviceService = {
	list: () => API.get<ServiceDTO[]>("/service"),

	getById: (serviceId: string) =>
		API.get<ServiceDTO>(`/service/${serviceId}`),

	listByCompany: (companyId: string) =>
		API.get<ServiceDTO[]>(`/service/company/${companyId}`),

	create: (companyId: string, data: CreateServiceDTO) =>
		API.post<ServiceDTO>(`/service/company/${companyId}`, data),

	listCategories: () =>
		API.get<ServiceCategoryDTO[]>("/service-categories"),
};
