import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/updater.js'),
      name: 'CearteeUpdater',
      formats: ['iife'],
      fileName: () => 'updater.bundle.js'
    },
    outDir: 'src',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
