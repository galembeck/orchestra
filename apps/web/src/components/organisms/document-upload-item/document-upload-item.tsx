/** biome-ignore-all lint/style/noNestedTernary: required in this context */

import { formatBytes } from "@repo/core/utils/format-bytes";
import { Button } from "@repo/ui/components/atoms/button/button";
import {
	CheckCircle2,
	FileText,
	Loader2,
	Trash2,
	Upload,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { INITIAL_DOCUMENT_STATE } from "@/constants/_auth/initial-document-state";
import type { DocumentState } from "@/types/_auth/general/document-state";
import type { UploadStatus } from "@/types/_auth/general/upload-status";

interface DocumentUploadItemProps {
	initialFile?: File;
	label: string;
	onStatusChange: (status: UploadStatus, file?: File) => void;
	required: boolean;
}

export function DocumentUploadItem({
	label,
	required,
	initialFile,
	onStatusChange,
}: DocumentUploadItemProps) {
	const [state, setState] = useState<DocumentState>(
		initialFile
			? { status: "uploaded", file: initialFile, progress: 100 }
			: INITIAL_DOCUMENT_STATE
	);

	const inputRef = useRef<HTMLInputElement>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(
		() => () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		},
		[]
	);

	const startUpload = (file: File) => {
		setState({ status: "uploading", file, progress: 0 });
		onStatusChange("uploading");

		let current = 0;

		intervalRef.current = setInterval(() => {
			current += Math.random() * 18 + 5;

			if (current >= 100) {
				// biome-ignore lint/style/noNonNullAssertion: not important in this context
				clearInterval(intervalRef.current!);

				setState({ status: "uploaded", file, progress: 100 });

				onStatusChange("uploaded", file);
			} else {
				setState((prev) => ({ ...prev, progress: current }));
			}
		}, 180);
	};

	const cancelOrRemove = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		setState(INITIAL_DOCUMENT_STATE);

		onStatusChange("idle");

		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			startUpload(file);
			e.target.value = "";
		}
	};

	const borderClass =
		state.status === "uploading"
			? "border-accent"
			: state.status === "uploaded"
				? "border-border"
				: "border-border";

	return (
		<div
			className={`flex items-center gap-3 rounded-lg border bg-surface p-4 transition-colors ${borderClass}`}
		>
			<input
				accept=".pdf,.jpg,.jpeg,.png"
				className="hidden"
				onChange={handleFileChange}
				ref={inputRef}
				type="file"
			/>

			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-paper-soft">
				{state.status === "uploading" ? (
					<Loader2 className="h-4 w-4 animate-spin text-foreground-accent" />
				) : state.status === "uploaded" ? (
					<FileText className="h-4 w-4 text-success" />
				) : (
					<Upload className="h-4 w-4 text-foreground-tertiary" />
				)}
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<p className="font-inter font-medium text-[13px] text-foreground-primary">
					{label}

					{required && <span className="ml-1 text-foreground-tertiary">*</span>}
				</p>

				{state.status === "uploading" && state.file && (
					<>
						<p className="font-inter text-[11px] text-foreground-tertiary">
							enviando... {Math.floor(state.progress)}% ·{" "}
							{formatBytes((state.progress / 100) * state.file.size)} de{" "}
							{formatBytes(state.file.size)}
						</p>

						<div className="mt-0.5 h-1 overflow-hidden rounded-full bg-border">
							<div
								className="h-full rounded-full bg-accent transition-all duration-200"
								style={{ width: `${state.progress}%` }}
							/>
						</div>
					</>
				)}

				{state.status === "uploaded" && state.file && (
					<p className="truncate font-inter text-[11px] text-foreground-tertiary">
						{state.file.name} · {formatBytes(state.file.size)}
					</p>
				)}

				{state.status === "idle" && (
					<p className="font-inter text-[11px] text-foreground-tertiary">
						Clique para escolher · PDF, JPG ou PNG até 10MB
					</p>
				)}
			</div>

			<div className="flex shrink-0 items-center gap-2">
				{state.status === "idle" && (
					<Button
						className="h-8 px-3 text-[12px]"
						onClick={() => inputRef.current?.click()}
						size="sm"
						type="button"
						variant="secondary"
					>
						Escolher
					</Button>
				)}

				{state.status === "uploading" && (
					<button
						className="flex h-6 w-6 items-center justify-center rounded-full text-foreground-tertiary transition-colors hover:bg-surface-paper-soft hover:text-foreground-primary"
						onClick={cancelOrRemove}
						type="button"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				)}

				{state.status === "uploaded" && (
					<>
						<span className="mr-2 flex items-center gap-1 font-inter font-medium text-[12px] text-success">
							<CheckCircle2 className="h-3.5 w-3.5" />
							Enviado
						</span>

						<button
							className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-red-100 text-danger transition-colors hover:border-danger/20 hover:bg-red-100/50 hover:text-danger/90"
							onClick={cancelOrRemove}
							title="Remover documento"
							type="button"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</>
				)}
			</div>
		</div>
	);
}
