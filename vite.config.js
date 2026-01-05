// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        team: resolve(__dirname, 'team.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        legal: resolve(__dirname, 'legal.html'),
        error404: resolve(__dirname, '404.html'),
        // Añade aquí las fichas de películas si tienes:
        carneycal: resolve(__dirname, 'carneycal.html'),
        elramo: resolve(__dirname, 'elramo.html'),
        boysthatcurl: resolve(__dirname, 'boysthatcurl.html'),
        cumbreserena: resolve(__dirname, 'cumbreserena.html'),
      },
    },
  },
})