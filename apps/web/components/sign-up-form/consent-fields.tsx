"use client";

import {
  PRIVACY_PATH,
  TERMS_PATH,
} from "@orchestra/shared/constants/navigation";
import { CheckboxField } from "@orchestra/ui/components/checkbox-field/checkbox-field";
import { TEXT_LINK_CLASS_NAME } from "@orchestra/ui/lib/text-link-styles";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface ConsentFieldsProps {
  ageError?: string;
  ageLabel: string;
  termsError?: string;
}

export function ConsentFields({
  ageError,
  ageLabel,
  termsError,
}: ConsentFieldsProps) {
  const t = useTranslations("auth.signUp");

  return (
    <fieldset className="flex flex-col gap-3.5 pt-1">
      <legend className="sr-only">{t("consentLegend")}</legend>

      <CheckboxField
        error={termsError}
        label={t.rich("terms", {
          privacy: (chunks) => (
            <Link
              className={TEXT_LINK_CLASS_NAME}
              href={PRIVACY_PATH}
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </Link>
          ),
          terms: (chunks) => (
            <Link
              className={TEXT_LINK_CLASS_NAME}
              href={TERMS_PATH}
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </Link>
          ),
        })}
        name="acceptedTerms"
        required
      />

      <CheckboxField
        error={ageError}
        label={ageLabel}
        name="isAdult"
        required
      />
    </fieldset>
  );
}
