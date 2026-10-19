import { defineConfig, devices } from "@playwright/test";

const frontendUrl = "http://127.0.0.1:5173";
const backendUrl = "http://127.0.0.1:5000";
const pythonExecutable = process.env.PYTHON || "python";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: frontendUrl,
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], browserName: "chromium" },
    },
  ],
  webServer: [
    {
    
      command: `"${pythonExecutable}" app.py`,
      cwd: "../backend",
      url: `${backendUrl}/api/students`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "npm run dev -- --host 127.0.0.1",
      url: frontendUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
