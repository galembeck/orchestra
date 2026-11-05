import type { Locale } from "@orchestra/shared/constants/i18n";
import { renderEmail } from "./email-layout.js";

interface InviteEmailCopy {
  action: string;
  footnote: string;
  greeting: string;
  paragraph: (companyName: string) => string;
  preheader: string;
  subject: (companyName: string) => string;
}

const INVITE_COPY = {
  en: {
    action: "Accept invitation",
    footnote:
      "If you weren't expecting this invitation, you can ignore this email. If the button doesn't work, copy and paste this link into your browser:",
    greeting: "You've been invited!",
    paragraph: (companyName) =>
      `You've been invited to join ${companyName} on Orchestra. Accept the invitation to get started.`,
    preheader: "You've been invited to join a company on Orchestra.",
    subject: (companyName) => `You've been invited to join ${companyName}`,
  },
  "pt-BR": {
    action: "Aceitar convite",
    footnote:
      "Se você não esperava este convite, pode ignorar este e-mail. Se o botão não funcionar, copie e cole este link no navegador:",
    greeting: "Você foi convidado!",
    paragraph: (companyName) =>
      `Você foi convidado para fazer parte da ${companyName} na Orchestra. Aceite o convite para começar.`,
    preheader:
      "Você foi convidado para fazer parte de uma empresa na Orchestra.",
    subject: (companyName) => `Você foi convidado para a ${companyName}`,
  },
} as const satisfies Record<Locale, InviteEmailCopy>;

export interface InviteEmailInput {
  companyName: string;
  locale: Locale;
  url: string;
}

export const renderInviteEmail = ({
  companyName,
  locale,
  url,
}: InviteEmailInput) => {
  const copy = INVITE_COPY[locale];

  return renderEmail({
    action: { label: copy.action, url },
    footnote: copy.footnote,
    greeting: copy.greeting,
    locale,
    paragraphs: [copy.paragraph(companyName)],
    preheader: copy.preheader,
    subject: copy.subject(companyName),
  });
};
