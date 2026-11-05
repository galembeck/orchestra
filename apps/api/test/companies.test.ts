import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createMemberFixture,
  createTestApp,
  createVerifiedUserFixture,
  resetDatabase,
  type TestApp,
} from "./helpers/test-app.js";

describe("POST /companies", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("400s for an invalid body", async () => {
    const { cookie } = await createVerifiedUserFixture(testApp);

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie },
      method: "POST",
      payload: JSON.stringify({ name: "" }),
      url: "/companies",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ code: "VALIDATION_ERROR" });
  });

  it("creates a company and makes the caller its ADMIN owner", async () => {
    const { cookie, userId } = await createVerifiedUserFixture(testApp);

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie },
      method: "POST",
      payload: JSON.stringify({ name: "Acme Services" }),
      url: "/companies",
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({ name: "Acme Services" });

    const member = await testApp.database.member.findUniqueOrThrow({
      where: { userId },
    });
    expect(member.role).toBe("ADMIN");

    const company = await testApp.database.company.findUniqueOrThrow({
      where: { id: member.companyId },
    });
    expect(company.ownerId).toBe(userId);
  });

  it("409s if the caller already belongs to a company", async () => {
    const { cookie } = await createMemberFixture(testApp, { role: "ADMIN" });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie },
      method: "POST",
      payload: JSON.stringify({ name: "Another Co" }),
      url: "/companies",
    });

    expect(response.statusCode).toBe(409);
  });
});

describe("GET /companies/:slug", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("404s for a non-member", async () => {
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
  });

  it("200s with the company for a member", async () => {
    const { cookie, companySlug } = await createMemberFixture(testApp, {
      companyName: "Acme Services",
      role: "MEMBER",
    });

    const response = await testApp.app.inject({
      headers: { cookie },
      method: "GET",
      url: `/companies/${companySlug}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      name: "Acme Services",
      slug: companySlug,
    });
  });
});

describe("PATCH /companies/:slug", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("403s when a non-owner ADMIN tries to rename", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const secondAdmin = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "ADMIN",
    });

    const response = await testApp.app.inject({
      headers: {
        "content-type": "application/json",
        cookie: secondAdmin.cookie,
      },
      method: "PATCH",
      payload: JSON.stringify({ name: "Renamed Co" }),
      url: `/companies/${owner.companySlug}`,
    });

    expect(response.statusCode).toBe(403);
  });

  it("200s when the owner renames", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "PATCH",
      payload: JSON.stringify({ name: "Renamed Co" }),
      url: `/companies/${owner.companySlug}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ name: "Renamed Co" });
  });
});

describe("POST /companies/:slug/transfer-ownership", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("403s for a non-owner", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const secondAdmin = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "ADMIN",
    });
    const ownerMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: owner.userId },
    });

    const response = await testApp.app.inject({
      headers: {
        "content-type": "application/json",
        cookie: secondAdmin.cookie,
      },
      method: "POST",
      payload: JSON.stringify({ newOwnerMemberId: ownerMember.id }),
      url: `/companies/${owner.companySlug}/transfer-ownership`,
    });

    expect(response.statusCode).toBe(403);
  });

  it("transfers ownership and swaps roles", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const secondAdmin = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "ADMIN",
    });
    const secondAdminMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: secondAdmin.userId },
    });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "POST",
      payload: JSON.stringify({ newOwnerMemberId: secondAdminMember.id }),
      url: `/companies/${owner.companySlug}/transfer-ownership`,
    });

    expect(response.statusCode).toBe(204);

    const company = await testApp.database.company.findUniqueOrThrow({
      where: { id: owner.companyId },
    });
    expect(company.ownerId).toBe(secondAdmin.userId);

    const newOwnerMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: secondAdmin.userId },
    });
    expect(newOwnerMember.role).toBe("ADMIN");

    const oldOwnerMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: owner.userId },
    });
    expect(oldOwnerMember.role).toBe("ADMIN");
  });
});

describe("PUT /companies/:slug/job-roles", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("403s for a non-owner ADMIN", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const secondAdmin = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "ADMIN",
    });

    const response = await testApp.app.inject({
      headers: {
        "content-type": "application/json",
        cookie: secondAdmin.cookie,
      },
      method: "PUT",
      payload: JSON.stringify({ jobRoleIds: [] }),
      url: `/companies/${owner.companySlug}/job-roles`,
    });

    expect(response.statusCode).toBe(403);
  });

  it("replaces the company's selected job roles", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const plumber = await testApp.database.jobRole.create({
      data: { key: "plumber", slug: "plumber" },
    });
    const electrician = await testApp.database.jobRole.create({
      data: { key: "electrician", slug: "electrician" },
    });

    const putResponse = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "PUT",
      payload: JSON.stringify({
        jobRoleIds: [plumber.id, electrician.id],
      }),
      url: `/companies/${owner.companySlug}/job-roles`,
    });
    expect(putResponse.statusCode).toBe(200);

    const getResponse = await testApp.app.inject({
      headers: { cookie: owner.cookie },
      method: "GET",
      url: `/companies/${owner.companySlug}/job-roles`,
    });
    expect(getResponse.statusCode).toBe(200);
    const { jobRoles } = getResponse.json<{
      jobRoles: { id: string }[];
    }>();
    expect(jobRoles.map((role) => role.id).sort()).toEqual(
      [plumber.id, electrician.id].sort()
    );
  });

  it("400s for an unknown jobRoleId", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "PUT",
      payload: JSON.stringify({ jobRoleIds: ["unknown-id"] }),
      url: `/companies/${owner.companySlug}/job-roles`,
    });

    expect(response.statusCode).toBe(400);
  });

  it("prunes stale member job-role assignments when a job role is deselected", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const ownerMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: owner.userId },
    });
    const plumber = await testApp.database.jobRole.create({
      data: { key: "plumber", slug: "plumber" },
    });
    const electrician = await testApp.database.jobRole.create({
      data: { key: "electrician", slug: "electrician" },
    });
    await testApp.database.companyJobRole.createMany({
      data: [
        { companyId: owner.companyId, jobRoleId: plumber.id },
        { companyId: owner.companyId, jobRoleId: electrician.id },
      ],
    });
    await testApp.database.memberJobRole.createMany({
      data: [
        { jobRoleId: plumber.id, memberId: ownerMember.id },
        { jobRoleId: electrician.id, memberId: ownerMember.id },
      ],
    });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "PUT",
      payload: JSON.stringify({ jobRoleIds: [plumber.id] }),
      url: `/companies/${owner.companySlug}/job-roles`,
    });

    expect(response.statusCode).toBe(200);

    const assignments = await testApp.database.memberJobRole.findMany({
      where: { memberId: ownerMember.id },
    });
    expect(assignments).toHaveLength(1);
    expect(assignments[0]?.jobRoleId).toBe(plumber.id);
  });
});
