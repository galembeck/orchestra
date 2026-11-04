import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  display: "swap",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  description:
    "Encontre profissionais verificados perto de você. Converse pelo app, acompanhe ao vivo e pague pelo PIX.",
  title: "Orchestra | Componha o serviço certo, na hora certa",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      lang="pt-BR"
    >
      <body>{children}</body>
    </html>
  );
}
