import { describe, expect, it } from "vitest";
import { renderVerificationEmail } from "./auth-emails.js";
import { escapeHtml } from "./email-layout.js";

describe("escapeHtml", () => {
  it("escapes every HTML-significant character", () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;"
    );
  });
});

describe("renderVerificationEmail", () => {
  const email = renderVerificationEmail({
    locale: "en",
    name: "<script>alert(1)</script>",
    url: "https://orchestra.test/api/auth/verify-email?token=abc&callbackURL=/",
  });

  it("never injects the user's name as markup", () => {
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&lt;script&gt;");
  });

  it("includes the link in both the HTML and the plain-text versions", () => {
    expect(email.html).toContain("token=abc&amp;callbackURL=/");
    expect(email.text).toContain(
      "https://orchestra.test/api/auth/verify-email?token=abc&callbackURL=/"
    );
  });

  it("uses the requested language", () => {
    expect(email.subject).toBe("Confirm your email on Orchestra");
    expect(email.html).toContain('<html lang="en">');
  });
});
