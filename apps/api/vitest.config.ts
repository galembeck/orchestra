import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    globalSetup: ["./test/global-setup.ts"],
    hookTimeout: 60_000,
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
    testTimeout: 30_000,
  },
});
