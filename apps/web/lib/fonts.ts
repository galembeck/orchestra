import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";

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

export const fontVariables = `${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`;
