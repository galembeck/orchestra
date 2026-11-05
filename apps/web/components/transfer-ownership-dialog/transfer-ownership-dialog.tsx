"use client";

import { Button } from "@orchestra/ui/components/button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@orchestra/ui/components/dialog/dialog";
import { SubmitButton } from "@orchestra/ui/components/submit-button/submit-button";
import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useId, useState } from "react";

export interface TransferOwnershipMember {
  id: string;
  name: string;
}

export interface TransferOwnershipDialogProps {
  members: TransferOwnershipMember[];
  onTransferred: () => void;
  slug: string;
}

export function TransferOwnershipDialog({
  members,
  onTransferred,
  slug,
}: TransferOwnershipDialogProps) {
  const t = useTranslations("companySettings.transferOwnership");
  const selectId = useId();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const newOwnerMemberId = new FormData(event.currentTarget).get(
        "newOwnerMemberId"
      );

      if (typeof newOwnerMemberId !== "string" || !newOwnerMemberId) {
        return;
      }

      setError(undefined);
      setIsPending(true);

      const response = await fetch(
        `/api/companies/${slug}/transfer-ownership`,
        {
          body: JSON.stringify({ newOwnerMemberId }),
          headers: { "content-type": "application/json" },
          method: "POST",
        }
      );

      setIsPending(false);

      if (response.ok) {
        setOpen(false);
        onTransferred();
        return;
      }

      setError(t("error"));
    },
    [onTransferred, slug, t]
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("trigger")}</Button>
      </DialogTrigger>

      <DialogContent closeLabel={t("close")}>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>

        <form className="mt-5 flex flex-col gap-5" onSubmit={handleSubmit}>
          {error ? (
            <p className="text-destructive text-sm/5" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-2">
            <label
              className="text-foreground text-sm/5 font-medium"
              htmlFor={selectId}
            >
              {t("memberLabel")}
            </label>
            <select
              className="border-input bg-card text-foreground h-12 w-full rounded-xl border px-4 text-base/5"
              id={selectId}
              name="newOwnerMemberId"
              required
            >
              <option value="">{t("memberPlaceholder")}</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <SubmitButton isPending={isPending} pendingLabel={t("pending")}>
            {t("confirm")}
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
