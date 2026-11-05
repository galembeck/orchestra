export function readFormValues(form: HTMLFormElement): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const element of form.elements) {
    if (element instanceof HTMLInputElement && element.name) {
      values[element.name] =
        element.type === "checkbox" ? element.checked : element.value;
    }
  }

  return values;
}
