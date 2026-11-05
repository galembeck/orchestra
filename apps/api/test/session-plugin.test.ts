import { beforeEach, describe, expect, it } from "vitest";
import {
  createMemberFixture,
  createTestApp,
  resetDatabase,
} from "./helpers/test-app.js";

describe("requireMembership", () => {
  beforeEach(resetDatabase);

  it("401s when there is no session", async () => {
    const testApp = await createTestApp();

    const response = await testApp.app.inject({
      method: "GET",
      url: "/companies/acme",
    });
    expect(response.statusCode).toBe(401);
    await testApp.app.close();
  });

  it("404s when the user has no membership in the given company", async () => {
    const testApp = await createTestApp();

    const { cookie } = await createMemberFixture(testApp, {
      companySlug: "other-co",
      role: "ADMIN",
    });
    const response = await testApp.app.inject({
      headers: { cookie },
      method: "GET",
      url: "/companies/acme",
    });
    expect(response.statusCode).toBe(404);
    await testApp.app.close();
  });
});
