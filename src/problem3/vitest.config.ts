import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/problem.tsx',
        'src/**/index.ts',
        'src/models/**',
        'src/setupTests.ts',
        'src/hooks/useWalletData.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@molecules': path.resolve(import.meta.dirname, './src/components/molecules'),
      '@organisms': path.resolve(import.meta.dirname, './src/components/organisms'),
      '@templates': path.resolve(import.meta.dirname, './src/components/templates'),
      '@pages': path.resolve(import.meta.dirname, './src/pages'),
      '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
      '@utils': path.resolve(import.meta.dirname, './src/utils'),
      '@models': path.resolve(import.meta.dirname, './src/models'),
      '@constants': path.resolve(import.meta.dirname, './src/constants'),
    },
  },
});
