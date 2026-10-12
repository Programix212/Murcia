import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Simula un navegador (window, document, localStorage) para poder
    // cargar perfiles.js y Estadistica.js tal como corren en la app.
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.test.js']
  }
});
