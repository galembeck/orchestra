import { Button } from "@repo/ui/components/atoms/button/button";
import { Card } from "@repo/ui/components/molecules/card/card";
import { ArrowLeft, Loader2, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { DocumentUploadItem } from "@/components/organisms/document-upload-item/document-upload-item";
import { REQUIRED_DOCUMENTS } from "@/constants/_auth/required-documents";
import type { DocumentsData } from "@/types/_auth/documents-data";
import type { DocumentKey } from "@/types/_auth/general/document-key";
import type { UploadStatus } from "@/types/_auth/general/upload-status";

interface CompanyDocumentStepProps {
	initialData?: DocumentsData;
	isPending: boolean;
	onBack: (partialData: DocumentsData) => void;
	onComplete: (data: DocumentsData) => void;
}

export function CompanyDocumentStep({
	initialData,
	onComplete,
	onBack,
	isPending,
}: CompanyDocumentStepProps) {
	const [uploadedFiles, setUploadedFiles] = useState<DocumentsData>(
		initialData || {}
	);

	const [docStatuses, setDocStatuses] = useState<
		Record<DocumentKey, UploadStatus>
	>(() => {
		const statuses: Partial<Record<DocumentKey, UploadStatus>> = {};

		for (const doc of REQUIRED_DOCUMENTS) {
			statuses[doc.key] = initialData?.[doc.key] ? "uploaded" : "idle";
		}

		return statuses as Record<DocumentKey, UploadStatus>;
	});

	const requiredUploaded = REQUIRED_DOCUMENTS.filter((d) => d.required).every(
		(d) => docStatuses[d.key] === "uploaded"
	);

	const handleStatusChange = (
		key: DocumentKey,
		status: UploadStatus,
		file?: File
	) => {
		setDocStatuses((prev) => ({ ...prev, [key]: status }));

		setUploadedFiles((prev) => {
			const newFiles = { ...prev };

			if (status === "uploaded" && file) {
				newFiles[key] = file;
			} else if (status === "idle") {
				delete newFiles[key];
			}

			return newFiles;
		});
	};

	return (
		<Card className="p-8">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<span className="font-jetbrains-mono font-medium text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]">
						Passo 4 de 5 · enviando para a equipe de verificação
					</span>

					<h2 className="font-instrument-serif text-[38px] text-foreground-primary -tracking-[0.8px]">
						Comprove sua atuação.
					</h2>

					<p className="font-inter text-[15px] text-foreground-secondary">
						Os documentos garantem que clientes encontrem empresas confiáveis.
						Aceitos: PDF, JPG ou PNG até 10MB.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					{REQUIRED_DOCUMENTS.map(({ key, label, required }) => (
						<DocumentUploadItem
							initialFile={uploadedFiles[key]}
							key={key}
							label={label}
							onStatusChange={(status, file) =>
								handleStatusChange(key, status, file)
							}
							required={required}
						/>
					))}
				</div>

				<div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-paper-soft p-4">
					<ShieldCheck className="h-4 w-4 shrink-0 text-foreground-accent" />

					<div className="flex flex-col gap-0.5">
						<p className="font-inter font-medium text-[13px] text-foreground-primary">
							Privacidade e LGPD
						</p>

						<p className="font-inter text-[12px] text-foreground-secondary">
							Os documentos são criptografados e usados apenas pela equipe de
							verificação. Você pode pedir a exclusão a qualquer momento.
						</p>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<Button
						className="gap-2"
						disabled={isPending}
						onClick={() => onBack(uploadedFiles)}
						type="button"
						variant="secondary"
					>
						<ArrowLeft className="h-4 w-4" />
						Voltar
					</Button>

					<Button
						className="gap-2"
						disabled={!requiredUploaded || isPending}
						onClick={() => onComplete(uploadedFiles)}
						type="submit"
					>
						{isPending ? (
							<span className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Enviando
							</span>
						) : (
							<span className="flex items-center gap-2">
								Enviar para análise
								<Send className="h-4 w-4" />
							</span>
						)}
					</Button>
				</div>
			</div>
		</Card>
	);
}
