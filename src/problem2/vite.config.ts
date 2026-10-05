/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

// https://vite.dev/config/
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@api': path.resolve(import.meta.dirname, './src/api'),
      '@atoms': path.resolve(import.meta.dirname, './src/components/atoms'),
      '@contexts': path.resolve(import.meta.dirname, './src/contexts'),
      '@molecules': path.resolve(import.meta.dirname, './src/components/molecules'),
      '@organisms': path.resolve(import.meta.dirname, './src/components/organisms'),
      '@pages': path.resolve(import.meta.dirname, './src/components/pages'),
      '@theme': path.resolve(import.meta.dirname, './src/theme.ts'),
      '@utils': path.resolve(import.meta.dirname, './src/utils'),
    },
  },
  test: {
    coverage: {
      exclude: ['src/contexts/**', 'src/main.tsx', 'src/vite-env.d.ts'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['./src/setupTests.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(import.meta.dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
