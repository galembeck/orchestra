import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createMemberFixture,
  createTestApp,
  resetDatabase,
  type TestApp,
} from "./helpers/test-app.js";

describe("GET /companies/:slug/members", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("lists members with their job roles", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const jobRole = await testApp.database.jobRole.create({
      data: { key: "plumber", slug: "plumber" },
    });
    const ownerMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: owner.userId },
    });
    await testApp.database.memberJobRole.create({
      data: { jobRoleId: jobRole.id, memberId: ownerMember.id },
    });

    const response = await testApp.app.inject({
      headers: { cookie: owner.cookie },
      method: "GET",
      url: `/companies/${owner.companySlug}/members`,
    });

    expect(response.statusCode).toBe(200);
    const { members } = response.json<{
      members: {
        id: string;
        jobRoles: { key: string }[];
        role: string;
        userId: string;
      }[];
    }>();
    expect(members).toHaveLength(1);
    expect(members[0]).toMatchObject({
      jobRoles: [{ key: "plumber" }],
      role: "ADMIN",
      userId: owner.userId,
    });
  });
});

describe("PATCH /companies/:slug/members/:memberId", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("403s for a non-admin", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const regular = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "MEMBER",
    });
    const regularMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: regular.userId },
    });

    const response = await testApp.app.inject({
      headers: {
        "content-type": "application/json",
        cookie: regular.cookie,
      },
      method: "PATCH",
      payload: JSON.stringify({ role: "ADMIN" }),
      url: `/companies/${owner.companySlug}/members/${regularMember.id}`,
    });

    expect(response.statusCode).toBe(403);
  });

  it("changes a member's role", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const regular = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "MEMBER",
    });
    const regularMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: regular.userId },
    });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "PATCH",
      payload: JSON.stringify({ role: "BILLING" }),
      url: `/companies/${owner.companySlug}/members/${regularMember.id}`,
    });

    expect(response.statusCode).toBe(200);
    const updated = await testApp.database.member.findUniqueOrThrow({
      where: { id: regularMember.id },
    });
    expect(updated.role).toBe("BILLING");
  });

  it("400s when targeting the owner", async () => {
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
      method: "PATCH",
      payload: JSON.stringify({ role: "MEMBER" }),
      url: `/companies/${owner.companySlug}/members/${ownerMember.id}`,
    });

    expect(response.statusCode).toBe(400);
  });
});

describe("PUT /companies/:slug/members/:memberId/job-roles", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("400s for a jobRoleId outside the company's selection", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const regular = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "MEMBER",
    });
    const regularMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: regular.userId },
    });
    const jobRole = await testApp.database.jobRole.create({
      data: { key: "plumber", slug: "plumber" },
    });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "PUT",
      payload: JSON.stringify({ jobRoleIds: [jobRole.id] }),
      url: `/companies/${owner.companySlug}/members/${regularMember.id}/job-roles`,
    });

    expect(response.statusCode).toBe(400);
  });

  it("assigns job roles that are in the company's selection", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const regular = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "MEMBER",
    });
    const regularMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: regular.userId },
    });
    const ownerMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: owner.userId },
    });
    const jobRole = await testApp.database.jobRole.create({
      data: { key: "plumber", slug: "plumber" },
    });
    await testApp.database.companyJobRole.create({
      data: { companyId: owner.companyId, jobRoleId: jobRole.id },
    });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "PUT",
      payload: JSON.stringify({ jobRoleIds: [jobRole.id] }),
      url: `/companies/${owner.companySlug}/members/${regularMember.id}/job-roles`,
    });

    expect(response.statusCode).toBe(200);
    const assignments = await testApp.database.memberJobRole.findMany({
      where: { memberId: regularMember.id },
    });
    expect(assignments).toHaveLength(1);
    expect(assignments[0]?.jobRoleId).toBe(jobRole.id);
    expect(ownerMember.companyId).toBe(owner.companyId);
  });
});

describe("DELETE /companies/:slug/members/:memberId", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("400s when targeting the owner", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const secondAdmin = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "ADMIN",
    });
    const ownerMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: owner.userId },
    });

    const response = await testApp.app.inject({
      headers: { cookie: secondAdmin.cookie },
      method: "DELETE",
      url: `/companies/${owner.companySlug}/members/${ownerMember.id}`,
    });

    expect(response.statusCode).toBe(400);
  });

  it("removes a non-owner member and their job-role assignments", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const regular = await createMemberFixture(testApp, {
      companySlug: owner.companySlug,
      role: "MEMBER",
    });
    const regularMember = await testApp.database.member.findUniqueOrThrow({
      where: { userId: regular.userId },
    });
    const jobRole = await testApp.database.jobRole.create({
      data: { key: "plumber", slug: "plumber" },
    });
    await testApp.database.companyJobRole.create({
      data: { companyId: owner.companyId, jobRoleId: jobRole.id },
    });
    await testApp.database.memberJobRole.create({
      data: { jobRoleId: jobRole.id, memberId: regularMember.id },
    });

    const response = await testApp.app.inject({
      headers: { cookie: owner.cookie },
      method: "DELETE",
      url: `/companies/${owner.companySlug}/members/${regularMember.id}`,
    });

    expect(response.statusCode).toBe(204);
    const found = await testApp.database.member.findUnique({
      where: { id: regularMember.id },
    });
    expect(found).toBeNull();
    const assignments = await testApp.database.memberJobRole.findMany({
      where: { memberId: regularMember.id },
    });
    expect(assignments).toHaveLength(0);
  });
});
