import type { Locale } from "@orchestra/shared/constants/i18n";

const HTML_ESCAPES: Record<string, string> = {
  "'": "&#39;",
  '"': "&quot;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
};

const HTML_ESCAPE_PATTERN = /[&<>"']/gu;

export const escapeHtml = (value: string) =>
  value.replace(
    HTML_ESCAPE_PATTERN,
    (character) => HTML_ESCAPES[character] ?? character
  );

export interface EmailAction {
  label: string;
  url: string;
}

export interface EmailContent {
  action: EmailAction;
  footnote: string;
  greeting: string;
  locale: Locale;
  paragraphs: readonly string[];
  preheader: string;
  subject: string;
}

export interface RenderedEmail {
  html: string;
  subject: string;
  text: string;
}

const INK = "#0d1426";
const GRAPHITE = "#5a6276";
const COBALT = "#2547d0";
const STAFF = "#e4e7ee";
const PAPER = "#ffffff";
const MIST = "#f6f7fa";

const renderParagraph = (paragraph: string) =>
  `<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:${INK};">${escapeHtml(paragraph)}</p>`;

export const renderEmail = ({
  action,
  footnote,
  greeting,
  locale,
  paragraphs,
  preheader,
  subject,
}: EmailContent): RenderedEmail => {
  const safeUrl = escapeHtml(action.url);

  const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${MIST};font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${MIST};padding:40px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${PAPER};border:1px solid ${STAFF};border-radius:18px;">
<tr><td style="padding:40px 40px 8px;">
<p style="margin:0 0 32px;font-family:Georgia,serif;font-size:26px;line-height:30px;color:${INK};">Orchestra</p>
<p style="margin:0 0 16px;font-size:20px;line-height:28px;font-weight:600;color:${INK};">${escapeHtml(greeting)}</p>
${paragraphs.map(renderParagraph).join("\n")}
</td></tr>
<tr><td style="padding:8px 40px 32px;">
<a href="${safeUrl}" style="display:inline-block;background:${COBALT};color:${PAPER};font-size:15px;line-height:18px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:999px;">${escapeHtml(action.label)}</a>
</td></tr>
<tr><td style="padding:0 40px 40px;border-top:1px solid ${STAFF};">
<p style="margin:24px 0 8px;font-size:13px;line-height:20px;color:${GRAPHITE};">${escapeHtml(footnote)}</p>
<p style="margin:0;font-size:13px;line-height:20px;color:${GRAPHITE};word-break:break-all;"><a href="${safeUrl}" style="color:${COBALT};">${safeUrl}</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    greeting,
    "",
    ...paragraphs.flatMap((paragraph) => [paragraph, ""]),
    `${action.label}: ${action.url}`,
    "",
    footnote,
  ].join("\n");

  return { html, subject, text };
};
