import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'devoir-pwa',
      short_name: 'devoir-pwa',
      description: 'devoir-pwa',
      theme_color: '#ffffff',
      display: "standalone",
      icons: [
        {
      src: "src/assets/react/svg",
      sizes: "48x48",
      type: "image/png"
        },
     ],
     start_url: "./?utm_source=web_app_manifest"
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          
          urlPattern: /^https:\/\/devto-news-cache\.dev\.to\/api\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'api-article-search',
            networkTimeoutSeconds: 2,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24, 
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
      
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})