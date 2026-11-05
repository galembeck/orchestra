import { createTransport } from "nodemailer";

export interface MailMessage {
  html: string;
  subject: string;
  text: string;
  to: string;
}

export interface Mailer {
  close: () => Promise<void>;
  send: (message: MailMessage) => Promise<void>;
}

export interface SmtpMailerOptions {
  from: string;
  url: string;
}

export const createSmtpMailer = ({ from, url }: SmtpMailerOptions): Mailer => {
  const transport = createTransport(url);

  return {
    close: () => {
      transport.close();
      return Promise.resolve();
    },
    send: async (message) => {
      await transport.sendMail({ from, ...message });
    },
  };
};
