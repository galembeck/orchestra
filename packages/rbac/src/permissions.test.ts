import { describe, expect, it } from "vitest";
import { getUserPermissions } from "./utils/get-user-permissions.js";

describe("ADMIN", () => {
  it("can manage everything by default", () => {
    const { can } = getUserPermissions("user-1", "ADMIN");
    expect(can("manage", "Member")).toBe(true);
  });

  it("cannot update or transfer a company it doesn't own", () => {
    const { cannot } = getUserPermissions("user-1", "ADMIN");
    const company = {
      __typename: "Company" as const,
      id: "c1",
      ownerId: "owner-2",
    };
    expect(cannot("update", company)).toBe(true);
    expect(cannot("transfer_ownership", company)).toBe(true);
  });

  it("can update and transfer a company it owns", () => {
    const { can } = getUserPermissions("user-1", "ADMIN");
    const company = {
      __typename: "Company" as const,
      id: "c1",
      ownerId: "user-1",
    };
    expect(can("update", company)).toBe(true);
    expect(can("transfer_ownership", company)).toBe(true);
  });
});

describe("BILLING", () => {
  it("can manage Billing and read Company, nothing else", () => {
    const { can, cannot } = getUserPermissions("user-1", "BILLING");
    expect(can("manage", "Billing")).toBe(true);
    expect(can("get", "Company")).toBe(true);
    expect(cannot("get", "Member")).toBe(true);
    expect(cannot("manage", "Member")).toBe(true);
  });
});

describe("MEMBER", () => {
  it("can only read Company and Member", () => {
    const { can, cannot } = getUserPermissions("user-1", "MEMBER");
    expect(can("get", "Company")).toBe(true);
    expect(can("get", "Member")).toBe(true);
    expect(cannot("update", "Member")).toBe(true);
    expect(cannot("manage", "Billing")).toBe(true);
  });
});
