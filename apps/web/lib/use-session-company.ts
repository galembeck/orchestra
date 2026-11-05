"use client";

import { authClient } from "@/lib/auth-client";

export interface SessionCompany {
  role: "ADMIN" | "BILLING" | "MEMBER";
  slug: string;
}

export function useSessionCompany() {
  const { data: session, isPending } = authClient.useSession();
  const company = (
    session?.user as unknown as { company: SessionCompany | null } | undefined
  )?.company;

  return { company, isPending, session };
}
