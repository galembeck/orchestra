import type { Locale } from "@orchestra/shared/constants/i18n";
import { type RenderedEmail, renderEmail } from "./email-layout.js";

interface AuthEmailCopy {
  action: string;
  footnote: string;
  greeting: (name: string) => string;
  paragraphs: readonly string[];
  preheader: string;
  subject: string;
}

const VERIFICATION_COPY = {
  en: {
    action: "Confirm email",
    footnote:
      "This link expires in 1 hour. If you didn't create an Orchestra account, you can ignore this email. If the button doesn't work, copy and paste this link into your browser:",
    greeting: (name) => `Hi, ${name}!`,
    paragraphs: [
      "Thanks for joining Orchestra. Confirm your email address to activate your account and start finding verified professionals near you.",
    ],
    preheader: "Confirm your email to activate your Orchestra account.",
    subject: "Confirm your email on Orchestra",
  },
  "pt-BR": {
    action: "Confirmar e-mail",
    footnote:
      "Este link expira em 1 hora. Se você não criou uma conta na Orchestra, ignore este e-mail. Se o botão não funcionar, copie e cole este link no navegador:",
    greeting: (name) => `Olá, ${name}!`,
    paragraphs: [
      "Que bom ter você na Orchestra. Confirme seu endereço de e-mail para ativar sua conta e começar a encontrar profissionais verificados perto de você.",
    ],
    preheader: "Confirme seu e-mail para ativar sua conta na Orchestra.",
    subject: "Confirme seu e-mail na Orchestra",
  },
} as const satisfies Record<Locale, AuthEmailCopy>;

const EXISTING_ACCOUNT_COPY = {
  en: {
    action: "Sign in",
    footnote:
      "If you didn't try to create an account, you can safely ignore this email. Your account is unchanged. If the button doesn't work, copy and paste this link into your browser:",
    greeting: (name) => `Hi, ${name}!`,
    paragraphs: [
      "Someone tried to create a new Orchestra account with this email address. You already have an account, so no new one was created.",
      "If it was you, just sign in with your existing account.",
    ],
    preheader: "You already have an Orchestra account with this email.",
    subject: "You already have an Orchestra account",
  },
  "pt-BR": {
    action: "Entrar",
    footnote:
      "Se não foi você, pode ignorar este e-mail com segurança. Sua conta continua igual. Se o botão não funcionar, copie e cole este link no navegador:",
    greeting: (name) => `Olá, ${name}!`,
    paragraphs: [
      "Alguém tentou criar uma nova conta na Orchestra com este endereço de e-mail. Você já tem uma conta, então nenhuma nova conta foi criada.",
      "Se foi você, é só entrar com a sua conta existente.",
    ],
    preheader: "Você já tem uma conta na Orchestra com este e-mail.",
    subject: "Você já tem uma conta na Orchestra",
  },
} as const satisfies Record<Locale, AuthEmailCopy>;

export interface AuthEmailInput {
  locale: Locale;
  name: string;
  url: string;
}

const buildAuthEmail = (
  copy: AuthEmailCopy,
  { locale, name, url }: AuthEmailInput
): RenderedEmail =>
  renderEmail({
    action: { label: copy.action, url },
    footnote: copy.footnote,
    greeting: copy.greeting(name),
    locale,
    paragraphs: copy.paragraphs,
    preheader: copy.preheader,
    subject: copy.subject,
  });

export const renderVerificationEmail = (input: AuthEmailInput) =>
  buildAuthEmail(VERIFICATION_COPY[input.locale], input);

export const renderExistingAccountEmail = (input: AuthEmailInput) =>
  buildAuthEmail(EXISTING_ACCOUNT_COPY[input.locale], input);
