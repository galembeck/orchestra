"use client";

import {
  type FieldErrors,
  getFieldErrors,
} from "@orchestra/shared/utils/get-field-errors";
import { readFormValues } from "@orchestra/shared/utils/read-form-values";
import { type FormEvent, useCallback, useState } from "react";
import type { z } from "zod";

const focusField = (form: HTMLFormElement, name: string | undefined) => {
  if (!name) {
    return;
  }

  const field = form.elements.namedItem(name);

  if (field instanceof HTMLElement) {
    field.focus();
  }
};

export function useSchemaForm<TSchema extends z.ZodObject>(schema: TSchema) {
  const [errors, setErrors] = useState<FieldErrors>({});

  const showErrors = useCallback(
    (form: HTMLFormElement, nextErrors: FieldErrors) => {
      setErrors(nextErrors);
      focusField(form, Object.keys(nextErrors)[0]);
    },
    []
  );

  const validate = useCallback(
    (form: HTMLFormElement): z.output<TSchema> | null => {
      const result = schema.safeParse(readFormValues(form));

      if (result.success) {
        setErrors({});
        return result.data;
      }

      showErrors(form, getFieldErrors(result.error));
      return null;
    },
    [schema, showErrors]
  );

  const validateFields = useCallback(
    (form: HTMLFormElement, fields: readonly (keyof z.input<TSchema>)[]) => {
      const result = schema.safeParse(readFormValues(form));
      const allErrors = result.success ? {} : getFieldErrors(result.error);
      const scopedErrors: FieldErrors = {};

      for (const field of fields) {
        const message = allErrors[String(field)];

        if (message) {
          scopedErrors[String(field)] = message;
        }
      }

      showErrors(form, scopedErrors);
      return Object.keys(scopedErrors).length === 0;
    },
    [schema, showErrors]
  );

  const clearFieldError = useCallback((event: FormEvent<HTMLFormElement>) => {
    const { target } = event;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    setErrors((current) => {
      if (current[target.name] === undefined) {
        return current;
      }

      const { [target.name]: _cleared, ...rest } = current;
      return rest;
    });
  }, []);

  const setFieldError = useCallback(
    (form: HTMLFormElement, field: string, message: string) => {
      showErrors(form, { [field]: message });
    },
    [showErrors]
  );

  return { clearFieldError, errors, setFieldError, validate, validateFields };
}
