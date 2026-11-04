import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/** Environment for the Next.js app. Client variables must start with NEXT_PUBLIC_. */
export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.url().default("http://localhost:3333"),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    // Next.js only inlines NEXT_PUBLIC_* values it can see statically.
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
