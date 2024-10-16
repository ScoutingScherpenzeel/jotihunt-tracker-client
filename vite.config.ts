import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteEnvs } from 'vite-envs';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const pwaManifest: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    maximumFileSizeToCacheInBytes: 1024 * 1024 * 10,
  },
  manifest: {
    name: 'Jotihunt Tracker',
    short_name: 'Jotihunt Tracker',
    description: 'Jotihunt Tracker voor Scouting Scherpenzeel e.o.',
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'icon_maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: 'screenshot_narrow.png',
        sizes: '900x1600',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: 'screenshot_wide.png',
        sizes: '3800x2136',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteEnvs({
      declarationFile: '.env.example',
      computedEnv: async () => {
        const path = await import('path');
        const fs = await import('fs/promises');

        const packageJson = JSON.parse(await fs.readFile(path.resolve(__dirname, 'package.json'), 'utf-8'));

        return {
          BUILD_TIME: Date.now(),
          VERSION: packageJson.version,
        };
      },
    }),
    VitePWA(pwaManifest),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    port: 80,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: '[name].[hash].js',
      },
    },
  },
});
