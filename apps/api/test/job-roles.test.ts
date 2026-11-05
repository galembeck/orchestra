import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createTestApp,
  createVerifiedUserFixture,
  resetDatabase,
  type TestApp,
} from "./helpers/test-app.js";

describe("GET /job-roles", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("401s without a session", async () => {
    const response = await testApp.app.inject({
      method: "GET",
      url: "/job-roles",
    });

    expect(response.statusCode).toBe(401);
  });

  it("returns the full seeded catalog", async () => {
    const { cookie } = await createVerifiedUserFixture(testApp);
    await testApp.database.jobRole.createMany({
      data: [
        { key: "plumber", slug: "plumber" },
        { key: "electrician", slug: "electrician" },
        { key: "painter", slug: "painter" },
      ],
    });

    const response = await testApp.app.inject({
      headers: { cookie },
      method: "GET",
      url: "/job-roles",
    });

    expect(response.statusCode).toBe(200);
    const { jobRoles } = response.json<{ jobRoles: { key: string }[] }>();
    expect(jobRoles.map((role) => role.key).sort()).toEqual(
      ["electrician", "painter", "plumber"].sort()
    );
  });
});
