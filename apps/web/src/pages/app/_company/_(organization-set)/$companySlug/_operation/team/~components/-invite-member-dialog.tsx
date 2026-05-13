import { useInviteMember } from "@repo/core/hooks/services/use-company";
import { useRoles } from "@repo/core/hooks/services/use-role";
import { Button } from "@repo/ui/components/atoms/button/button";
import { Input } from "@repo/ui/components/atoms/input/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/components/molecules/dialog/dialog";
import { UserPlus } from "lucide-react";
import { useState } from "react";

interface InviteMemberDialogProps {
	companyId: string;
}

export function InviteMemberDialog({ companyId }: InviteMemberDialogProps) {
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [roleId, setRoleId] = useState("");

	const { data: roles } = useRoles(companyId);
	const { mutate: invite, isPending } = useInviteMember(companyId);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!(email.trim() && roleId)) {
			return;
		}

		invite(
			{ userEmail: email.trim().toLowerCase(), roleId },
			{
				onSuccess: () => {
					setEmail("");
					setRoleId("");
					setOpen(false);
				},
			}
		);
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button className="gap-2" size="sm" variant="primary">
					<UserPlus className="h-4 w-4" />
					Convidar profissional
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Convidar profissional</DialogTitle>
					<DialogDescription>
						Envie um convite por e-mail. O profissional receberá um link para
						criar a conta e ingressar na sua equipe.
					</DialogDescription>
				</DialogHeader>

				<form className="flex flex-col gap-4" onSubmit={onSubmit}>
					<label
						className="flex flex-col gap-1.5 font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]"
						htmlFor="invite-email"
					>
						E-mail
						<Input
							autoComplete="off"
							className="font-inter text-sm normal-case tracking-normal"
							id="invite-email"
							onChange={(e) => setEmail(e.target.value)}
							placeholder="profissional@empresa.com"
							required
							type="email"
							value={email}
						/>
					</label>

					<label
						className="flex flex-col gap-1.5 font-jetbrains-mono text-[10px] text-foreground-tertiary uppercase tracking-[1.5px]"
						htmlFor="invite-role"
					>
						Cargo
						<select
							className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-inter text-foreground-primary text-sm outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"
							id="invite-role"
							onChange={(e) => setRoleId(e.target.value)}
							required
							value={roleId}
						>
							<option value="">Selecione um cargo...</option>
							{roles?.map((r) => (
								<option key={r.id} value={r.id}>
									{r.name}
								</option>
							))}
						</select>
					</label>

					<DialogFooter>
						<Button
							onClick={() => setOpen(false)}
							size="sm"
							type="button"
							variant="secondary"
						>
							Cancelar
						</Button>
						<Button
							disabled={isPending || !email || !roleId}
							size="sm"
							type="submit"
							variant="primary"
						>
							{isPending ? "Enviando..." : "Enviar convite"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
