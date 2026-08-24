import { defineConfig } from '@playwright/test';
import { baseConfig } from './playwright.base.config';

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
  },
  webServer: {
    command: 'npm run dev -- --port 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
    timeout: 180000,
  },
});
