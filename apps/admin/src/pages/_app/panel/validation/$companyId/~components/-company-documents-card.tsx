import type {
	CompanyDocumentType,
	CompanyRegistrationDocument,
} from "@repo/core/types/company-registration";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/molecules/card/card";
import { Download, FileText } from "lucide-react";

const DOCUMENT_TYPE_LABELS: Record<CompanyDocumentType, string> = {
	CNPJ_DOCUMENT: "Cartão CNPJ",
	ADDRESS_PROOF: "Comprovante de endereço",
	OWNER_IDENTITY: "Documento de identidade (responsável)",
	OPERATING_LICENSE: "Alvará de funcionamento",
};

function formatDate(dateString: string): string {
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(new Date(dateString));
}

interface DocumentRowProps {
	doc: CompanyRegistrationDocument;
}

function DocumentRow({ doc }: DocumentRowProps) {
	return (
		<div className="flex items-center justify-between gap-4 border-border border-b py-3 last:border-0 last:pb-0">
			<div className="flex min-w-0 items-center gap-3">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-secondary">
					<FileText className="h-4 w-4 text-foreground-tertiary" />
				</div>

				<div className="flex min-w-0 flex-col gap-0.5">
					<span className="truncate font-inter text-foreground-primary text-sm">
						{DOCUMENT_TYPE_LABELS[doc.type]}
					</span>
					<span className="truncate font-jetbrains-mono text-[11px] text-foreground-tertiary">
						{doc.fileName}
					</span>
				</div>
			</div>

			<div className="flex shrink-0 items-center gap-3">
				<span className="font-inter text-foreground-tertiary text-xs">
					{formatDate(doc.createdAt)}
				</span>
				<a
					aria-label={`Baixar ${DOCUMENT_TYPE_LABELS[doc.type]}`}
					className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-tertiary transition-colors hover:bg-surface-secondary hover:text-foreground-primary"
					download={doc.fileName}
					href={doc.downloadUrl}
					rel="noopener noreferrer"
					target="_blank"
				>
					<Download className="h-3.5 w-3.5" />
				</a>
			</div>
		</div>
	);
}

interface CompanyDocumentsCardProps {
	documents: CompanyRegistrationDocument[];
}

export function CompanyDocumentsCard({ documents }: CompanyDocumentsCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FileText className="h-4 w-4 text-foreground-tertiary" />
						<CardTitle>Documentos</CardTitle>
					</div>
					<span className="font-jetbrains-mono text-[11px] text-foreground-tertiary">
						{documents.length} arquivo{documents.length === 1 ? "" : "s"}
					</span>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{documents.length === 0 ? (
					<p className="py-4 text-center font-inter text-foreground-tertiary text-sm">
						Nenhum documento enviado.
					</p>
				) : (
					documents.map((doc) => <DocumentRow doc={doc} key={doc.id} />)
				)}
			</CardContent>
		</Card>
	);
}
