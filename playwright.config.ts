import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.mjs",
  use: { headless: true, launchOptions: { args: ["--no-sandbox"] } },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5187 --strictPort",
    url: "http://localhost:5187",
    env: {
      VITE_SUPABASE_URL: "https://lasmoras-test.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "test-public-key",
    },
    reuseExistingServer: false,
  },
});
