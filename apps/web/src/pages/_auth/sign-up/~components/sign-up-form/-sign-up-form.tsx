import { useRegisterCompany } from "@repo/core/hooks/services/use-company";
import { useUser } from "@repo/core/hooks/services/use-user";
import { ACCOUNT_TYPE } from "@repo/core/types/enums/account-type";
import { useState } from "react";
import { toast } from "sonner";
import type { AccountData } from "@/types/_auth/account-data";
import type { CompanyData } from "@/types/_auth/company-data";
import type { DocumentsData } from "@/types/_auth/documents-data";
import { FormStepIndicator } from "../-fom-step-indicator";
import { AccountStep } from "./form-steps/-account-step";
import {
	ClientAddressStep,
	type ClientAddressStepValues,
} from "./form-steps/client-registration/-client-address-step";
import {
	CompanyAddressStep,
	type CompanyAddressStepValues,
} from "./form-steps/company-registration/-company-address-step";
import { AnalysisStep } from "./form-steps/company-registration/-company-analysis-step";
import { CompanyDocumentStep } from "./form-steps/company-registration/-company-document-step";
import {
	CompanyInformationStep,
	type CompanyInformationStepValues,
} from "./form-steps/company-registration/-company-information-step";

interface SignUpData {
	account?: AccountData;
	clientAddress?: ClientAddressStepValues;
	company?: CompanyData;
	companyAddress?: CompanyAddressStepValues;
	companyDocuments?: DocumentsData;
	companyInformation?: CompanyInformationStepValues;
}

export function SignUpForm() {
	const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

	const [formData, setFormData] = useState<SignUpData>({});

	const selectedAccountType =
		formData.account?.accountType || ACCOUNT_TYPE.COMPANY;

	const { register: registerClient, isPending: isClientPending } = useUser();
	const { register: registerCompany, isPending: isCompanyPending } =
		useRegisterCompany();

	const isPending = isClientPending || isCompanyPending;

	const handleClientSubmit = (clientAddress: ClientAddressStepValues) => {
		const finalData = { ...formData, clientAddress };
		setFormData(finalData);

		if (!(finalData.account && finalData.clientAddress)) {
			toast.error("Erro", { description: "Dados incompletos para cadastro." });
			return;
		}

		registerClient({
			name: finalData.account.name,
			email: finalData.account.email,
			password: finalData.account.password,
			document: finalData.account.document,
			cellphone: finalData.account.cellphone,
			zipcode: finalData.clientAddress.zipcode,
			address: finalData.clientAddress.address,
			number: finalData.clientAddress.number,
			complement: finalData.clientAddress.complement,
			neighborhood: finalData.clientAddress.neighborhood,
			city: finalData.clientAddress.city,
			state: finalData.clientAddress.state,
			acceptTerms: finalData.account.acceptTerms,
		});
	};

	const handleCompanySubmit = (companyDocuments: DocumentsData) => {
		const finalData = { ...formData, companyDocuments };
		setFormData(finalData);

		if (
			!(
				finalData.account &&
				finalData.companyInformation &&
				finalData.companyAddress &&
				finalData.companyDocuments
			)
		) {
			toast.error("Ocorreu um erro ao registrar a empresa.", {
				description: "Os dados para cadastro estão incompletos.",
			});

			return;
		}

		registerCompany({
			ownerName: finalData.account.name,
			ownerEmail: finalData.account.email,
			ownerDocument: finalData.account.document,
			ownerPassword: finalData.account.password,
			ownerCellphone: finalData.account.cellphone,
			acceptTerms: finalData.account.acceptTerms,

			ownerZipcode: finalData.companyAddress.zipcode,
			ownerAddress: finalData.companyAddress.address,
			ownerNumber: finalData.companyAddress.number,
			ownerComplement: finalData.companyAddress.complement,
			ownerNeighborhood: finalData.companyAddress.neighborhood,
			ownerCity: finalData.companyAddress.city,
			ownerState: finalData.companyAddress.state,

			zipcode: finalData.companyAddress.zipcode,
			address: finalData.companyAddress.address,
			number: finalData.companyAddress.number,
			complement: finalData.companyAddress.complement,
			neighborhood: finalData.companyAddress.neighborhood,
			city: finalData.companyAddress.city,
			state: finalData.companyAddress.state,

			segment: finalData.companyInformation.segment,
			cnpj: finalData.companyInformation.cnpj,
			fantasyName: finalData.companyInformation.fantasyName,
			socialReason: finalData.companyInformation.socialReason,

			cnpjDocument: finalData.companyDocuments.cnpjDocument,
			addressProof: finalData.companyDocuments.addressProof,
			ownerIdentity: finalData.companyDocuments.ownerIdentity,
			operatingLicense: finalData.companyDocuments.operatingLicense,
		});
	};

	return (
		<div className="flex flex-col gap-8">
			<FormStepIndicator
				accountType={selectedAccountType}
				currentStep={currentStep}
			/>

			{currentStep === 1 && (
				<AccountStep
					initialData={formData.account}
					onComplete={(account) => {
						setFormData((prev) => ({ ...prev, account }));
						setCurrentStep(2);
					}}
				/>
			)}

			{currentStep === 2 &&
				formData.account?.accountType === ACCOUNT_TYPE.CLIENT && (
					<ClientAddressStep
						initialData={formData.clientAddress}
						isPending={isPending}
						onBack={() => setCurrentStep(1)}
						onComplete={handleClientSubmit}
					/>
				)}

			{currentStep === 2 &&
				formData.account?.accountType === ACCOUNT_TYPE.COMPANY && (
					<CompanyInformationStep
						initialData={formData.companyInformation}
						onBack={() => setCurrentStep(1)}
						onComplete={(companyInformation) => {
							setFormData((prev) => ({ ...prev, companyInformation }));
							setCurrentStep(3);
						}}
					/>
				)}

			{currentStep === 3 &&
				formData.account?.accountType === ACCOUNT_TYPE.COMPANY && (
					<CompanyAddressStep
						initialData={formData.companyAddress}
						onBack={(partialData) => {
							setFormData((prev) => ({ ...prev, companyAddress: partialData }));
							setCurrentStep(2);
						}}
						onComplete={(companyAddress) => {
							setFormData((prev) => ({ ...prev, companyAddress }));
							setCurrentStep(4);
						}}
					/>
				)}

			{currentStep === 4 &&
				formData.account?.accountType === ACCOUNT_TYPE.COMPANY && (
					<CompanyDocumentStep
						initialData={formData.companyDocuments}
						isPending={isPending}
						onBack={(partialData) => {
							setFormData((prev) => ({
								...prev,
								companyDocuments: partialData,
							}));
							setCurrentStep(3);
						}}
						onComplete={(companyDocuments) => {
							handleCompanySubmit(companyDocuments);
							setCurrentStep(5);
						}}
					/>
				)}

			{currentStep === 5 &&
				formData.account?.accountType === ACCOUNT_TYPE.COMPANY && (
					<AnalysisStep
						companyName={
							formData.company?.fantasyName || formData.company?.socialReason
						}
					/>
				)}
		</div>
	);
}
