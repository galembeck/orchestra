import { describe, expect, it } from "vitest";
import { localizePath, resolveLocale } from "./resolve-locale.js";

const requestWith = (headers: Record<string, string>) =>
  new Request("http://localhost/", { headers });

describe("resolveLocale", () => {
  it("falls back to Portuguese without a request", () => {
    expect(resolveLocale(undefined)).toBe("pt-BR");
  });

  it("prefers the locale cookie over Accept-Language", () => {
    const request = requestWith({
      "accept-language": "pt-BR,pt;q=0.9",
      cookie: "theme=dark; ORCHESTRA_LOCALE=en",
    });

    expect(resolveLocale(request)).toBe("en");
  });

  it("ignores an unsupported cookie value", () => {
    const request = requestWith({
      "accept-language": "en-US,en;q=0.8",
      cookie: "ORCHESTRA_LOCALE=fr",
    });

    expect(resolveLocale(request)).toBe("en");
  });

  it("matches a language without its region", () => {
    expect(resolveLocale(requestWith({ "accept-language": "pt-PT" }))).toBe(
      "pt-BR"
    );
  });

  it("falls back to Portuguese for unsupported languages", () => {
    expect(resolveLocale(requestWith({ "accept-language": "de-DE" }))).toBe(
      "pt-BR"
    );
  });
});

describe("localizePath", () => {
  it("keeps the default locale unprefixed", () => {
    expect(localizePath("pt-BR", "/sign-in")).toBe("/sign-in");
  });

  it("prefixes other locales", () => {
    expect(localizePath("en", "/sign-in")).toBe("/en/sign-in");
  });
});
