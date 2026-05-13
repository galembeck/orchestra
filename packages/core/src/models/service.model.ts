export interface ServiceCategoryDTO {
	icon: string;
	id: string;
	name: string;
	slug: string;
}

/** Owner-facing service shape. The address fields are pulled from the
 * company on the server, so they always reflect the company's current
 * registered address. */
export interface ServiceDTO {
	address: string;
	budgetable?: boolean;
	categoryIcon: string;

	categoryId: string;
	categoryName: string;
	city: string;
	companyFantasyName: string;

	companyId: string;
	complement?: string | null;

	createdAt: string;
	id: string;

	isActive: boolean;
	neighborhood: string;
	number: string;
	price?: number;

	rating: number;
	reviewsCount: number;

	serviceType: string;
	state: string;

	zipcode: string;
}

export interface CreateServiceDTO {
	budgetable?: boolean;
	categoryId: string;
	price?: number;
	serviceType: string;
}
