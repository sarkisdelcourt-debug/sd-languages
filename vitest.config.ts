import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const directory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@shared": path.resolve(directory, "packages/shared/src"),
      "@engine": path.resolve(directory, "packages/engine/src")
    }
  },
  test: {
    include: ["packages/**/*.test.ts", "apps/api/**/*.test.ts", "apps/web/**/*.test.ts"],
    environment: "node",
    coverage: {
      reporter: ["text", "html"]
    }
  }
});
