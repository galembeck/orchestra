import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createMemberFixture,
  createTestApp,
  createVerifiedUserFixture,
  resetDatabase,
  type TestApp,
} from "./helpers/test-app.js";

const PAST_DATE = new Date(Date.now() - 1000);
const FUTURE_DATE = new Date(Date.now() + 1000 * 60 * 60);

describe("POST /companies/:slug/invites", () => {
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

    const response = await testApp.app.inject({
      headers: {
        "content-type": "application/json",
        cookie: regular.cookie,
      },
      method: "POST",
      payload: JSON.stringify({ email: "invitee@example.com", role: "MEMBER" }),
      url: `/companies/${owner.companySlug}/invites`,
    });

    expect(response.statusCode).toBe(403);
  });

  it("creates an invite and sends an email", async () => {
    const owner = await createMemberFixture(testApp, {
      companyName: "Acme Services",
      role: "ADMIN",
    });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "POST",
      payload: JSON.stringify({ email: "invitee@example.com", role: "MEMBER" }),
      url: `/companies/${owner.companySlug}/invites`,
    });

    expect(response.statusCode).toBe(201);

    await testApp.backgroundTasks.drain();
    const message = testApp.mailer.sent.find(
      (sent) => sent.to === "invitee@example.com"
    );
    expect(message).toBeDefined();
    expect(message?.text).toContain("/invites/");
    expect(message?.text).toContain("/accept");
  });

  it("409s for a still-pending duplicate", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    await testApp.database.invite.create({
      data: {
        companyId: owner.companyId,
        email: "invitee@example.com",
        expiresAt: FUTURE_DATE,
        role: "MEMBER",
        token: "existing-token",
      },
    });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "POST",
      payload: JSON.stringify({ email: "invitee@example.com", role: "MEMBER" }),
      url: `/companies/${owner.companySlug}/invites`,
    });

    expect(response.statusCode).toBe(409);
  });

  it("overwrites an expired pending invite instead of conflicting", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const expired = await testApp.database.invite.create({
      data: {
        companyId: owner.companyId,
        email: "invitee@example.com",
        expiresAt: PAST_DATE,
        role: "MEMBER",
        token: "expired-token",
      },
    });

    const response = await testApp.app.inject({
      headers: { "content-type": "application/json", cookie: owner.cookie },
      method: "POST",
      payload: JSON.stringify({ email: "invitee@example.com", role: "MEMBER" }),
      url: `/companies/${owner.companySlug}/invites`,
    });

    expect(response.statusCode).toBe(201);

    const updated = await testApp.database.invite.findUniqueOrThrow({
      where: { id: expired.id },
    });
    expect(updated.token).not.toBe("expired-token");
    expect(updated.status).toBe("PENDING");
  });

  it("409s both responses when two invites race for the same email", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });

    const payload = JSON.stringify({
      email: "invitee@example.com",
      role: "MEMBER",
    });
    const [first, second] = await Promise.all([
      testApp.app.inject({
        headers: {
          "content-type": "application/json",
          cookie: owner.cookie,
        },
        method: "POST",
        payload,
        url: `/companies/${owner.companySlug}/invites`,
      }),
      testApp.app.inject({
        headers: {
          "content-type": "application/json",
          cookie: owner.cookie,
        },
        method: "POST",
        payload,
        url: `/companies/${owner.companySlug}/invites`,
      }),
    ]);

    const statuses = [first.statusCode, second.statusCode].sort();
    expect(statuses).toEqual([201, 409]);
  });
});

describe("POST /invites/:token/accept", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("400s if the invite is expired", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const { cookie } = await createVerifiedUserFixture(testApp, {
      email: "invitee@example.com",
    });
    await testApp.database.invite.create({
      data: {
        companyId: owner.companyId,
        email: "invitee@example.com",
        expiresAt: PAST_DATE,
        role: "MEMBER",
        token: "expired-token",
      },
    });

    const response = await testApp.app.inject({
      headers: { cookie },
      method: "POST",
      url: "/invites/expired-token/accept",
    });

    expect(response.statusCode).toBe(400);
  });

  it("400s if the signed-in email doesn't match the invite's email", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const { cookie } = await createVerifiedUserFixture(testApp, {
      email: "someone-else@example.com",
    });
    await testApp.database.invite.create({
      data: {
        companyId: owner.companyId,
        email: "invitee@example.com",
        expiresAt: FUTURE_DATE,
        role: "MEMBER",
        token: "valid-token",
      },
    });

    const response = await testApp.app.inject({
      headers: { cookie },
      method: "POST",
      url: "/invites/valid-token/accept",
    });

    expect(response.statusCode).toBe(400);
  });

  it("400s if the caller already belongs to a company", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const existingMember = await createMemberFixture(testApp, {
      role: "ADMIN",
    });
    const invitedUser = await testApp.database.user.findUniqueOrThrow({
      where: { id: existingMember.userId },
    });
    await testApp.database.invite.create({
      data: {
        companyId: owner.companyId,
        email: invitedUser.email,
        expiresAt: FUTURE_DATE,
        role: "MEMBER",
        token: "valid-token",
      },
    });

    const response = await testApp.app.inject({
      headers: { cookie: existingMember.cookie },
      method: "POST",
      url: "/invites/valid-token/accept",
    });

    expect(response.statusCode).toBe(400);
  });

  it("creates a Member with the invited role and marks the invite ACCEPTED", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const { cookie, userId } = await createVerifiedUserFixture(testApp, {
      email: "invitee@example.com",
    });
    await testApp.database.invite.create({
      data: {
        companyId: owner.companyId,
        email: "invitee@example.com",
        expiresAt: FUTURE_DATE,
        role: "BILLING",
        token: "valid-token",
      },
    });

    const response = await testApp.app.inject({
      headers: { cookie },
      method: "POST",
      url: "/invites/valid-token/accept",
    });

    expect(response.statusCode).toBe(204);

    const member = await testApp.database.member.findUniqueOrThrow({
      where: { userId },
    });
    expect(member.role).toBe("BILLING");
    expect(member.companyId).toBe(owner.companyId);

    const invite = await testApp.database.invite.findUniqueOrThrow({
      where: { token: "valid-token" },
    });
    expect(invite.status).toBe("ACCEPTED");
  });
});

describe("DELETE /companies/:slug/invites/:inviteId", () => {
  let testApp: TestApp;

  beforeEach(async () => {
    await resetDatabase();
    testApp = await createTestApp();
  });

  afterEach(async () => {
    await testApp.app.close();
  });

  it("revokes an invite", async () => {
    const owner = await createMemberFixture(testApp, { role: "ADMIN" });
    const invite = await testApp.database.invite.create({
      data: {
        companyId: owner.companyId,
        email: "invitee@example.com",
        expiresAt: FUTURE_DATE,
        role: "MEMBER",
        token: "valid-token",
      },
    });

    const response = await testApp.app.inject({
      headers: { cookie: owner.cookie },
      method: "DELETE",
      url: `/companies/${owner.companySlug}/invites/${invite.id}`,
    });

    expect(response.statusCode).toBe(204);
    const updated = await testApp.database.invite.findUniqueOrThrow({
      where: { id: invite.id },
    });
    expect(updated.status).toBe("REVOKED");
  });
});
