// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        legal: resolve(__dirname, 'legal.html'),
        error404: resolve(__dirname, '404.html'),
        // Añade aquí las fichas de películas si tienes:
        carneycal: resolve(__dirname, 'carneycal.html'),
        elramo: resolve(__dirname, 'elramo.html'),
        elpoder: resolve(__dirname, 'elpoder.html'),
        cumbreserena: resolve(__dirname, 'cumbreserena.html'),
      },
    },
  },
})