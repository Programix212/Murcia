import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        config: resolve(__dirname, 'src/Configuracion.html'),
        vista: resolve(__dirname, 'src/vista.html'),
        panel: resolve(__dirname, 'src/panel-docente.html'),
        etapas: resolve(__dirname, 'src/Etapas.html'),
        categorias: resolve(__dirname, 'src/Categorias.html'),
        lenguajes: resolve(__dirname, 'src/Lenguajes.html'),
        etica: resolve(__dirname, 'src/Etica.html'),
        saberes: resolve(__dirname, 'src/Saberesypensamientocientifico.html'),
        humano: resolve(__dirname, 'src/Delohumanoacomunitario.html')
      },
      // Estos módulos los provee Tauri en runtime, no hay que empaquetarlos
      external: [
        '@tauri-apps/plugin-updater',
        '@tauri-apps/plugin-process',
        '@tauri-apps/api'
      ]
    }
  }
});