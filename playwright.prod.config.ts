import { defineConfig } from '@playwright/test';
import { baseConfig } from './playwright.base.config';

export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    baseURL: 'https://os.cristianvaduva.com',
  },
  // No webServer for production tests
});
