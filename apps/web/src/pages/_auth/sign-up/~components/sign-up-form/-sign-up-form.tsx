import { useRegisterCompany } from "@repo/core/hooks/services/use-company";
import { useUser } from "@repo/core/hooks/services/use-user";
import { ACCOUNT_TYPE } from "@repo/core/types/enums/account-type";
import { useState } from "react";
import { toast } from "sonner";
import type { DocumentsData } from "@/types/_auth/documents-data";
import { FormStepIndicator } from "../-fom-step-indicator";
import { AccountStep, type AccountStepValues } from "./form-steps/-account-step";
import {
	ClientAddressStep,
	type ClientAddressStepValues,
} from "./form-steps/client-registration/-client-address-step";
import {
	CompanyAddressStep,
	type CompanyAddressStepValues,
} from "./form-steps/company-registration/-company-address-step";
import { AnalysisStep } from "./form-steps/company-registration/-company-analysis-step";
import { RegistrationErrorStep } from "./form-steps/company-registration/-company-registration-error-step";
import { CompanyDocumentStep } from "./form-steps/company-registration/-company-document-step";
import {
	CompanyInformationStep,
	type CompanyInformationStepValues,
} from "./form-steps/company-registration/-company-information-step";

interface SignUpData {
	account?: AccountStepValues;
	clientAddress?: ClientAddressStepValues;
	companyAddress?: CompanyAddressStepValues;
	companyDocuments?: DocumentsData;
	companyInformation?: CompanyInformationStepValues;
}

type RegistrationStatus = "idle" | "success" | "error";

export function SignUpForm() {
	const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
	const [formData, setFormData] = useState<SignUpData>({});
	const [registrationStatus, setRegistrationStatus] =
		useState<RegistrationStatus>("idle");
	const [registrationError, setRegistrationError] = useState<string>("");

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
			acceptTerms: finalData.account.acceptedTerms,
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

		registerCompany(
			{
				ownerName: finalData.account.name,
				ownerEmail: finalData.account.email,
				ownerDocument: finalData.account.document,
				ownerPassword: finalData.account.password,
				ownerCellphone: finalData.account.cellphone,
				acceptTerms: finalData.account.acceptedTerms,

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
			},
			{
				onSuccess: () => {
					setRegistrationStatus("success");
					setCurrentStep(5);
				},
				onError: (err) => {
					setRegistrationError(err.message || "");
					setRegistrationStatus("error");
					setCurrentStep(5);
				},
			},
		);
	};

	const handleRetry = () => {
		setRegistrationStatus("idle");
		setRegistrationError("");
		setCurrentStep(4);
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
						onComplete={handleCompanySubmit}
					/>
				)}

			{currentStep === 5 &&
				formData.account?.accountType === ACCOUNT_TYPE.COMPANY &&
				registrationStatus === "success" && (
					<AnalysisStep
						companyName={
							formData.companyInformation?.fantasyName ||
							formData.companyInformation?.socialReason
						}
					/>
				)}

			{currentStep === 5 &&
				formData.account?.accountType === ACCOUNT_TYPE.COMPANY &&
				registrationStatus === "error" && (
					<RegistrationErrorStep
						errorMessage={registrationError}
						onRetry={handleRetry}
					/>
				)}
		</div>
	);
}
