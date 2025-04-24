import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.svg'],
  manifest: {
    name: '用戶登入系統',
    short_name: '登入系統',
    description: '企業用戶登入系統',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/vue-login-app/', // 使用絕對路徑但包含 base
   icons: [
    {
      src: '/vue-login-app/pwa-192x192.png', // 使用絕對路徑包含 base
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/vue-login-app/pwa-512x512.png', // 使用絕對路徑包含 base
      sizes: '512x512',
      type: 'image/png'
    },
    {
      src: '/vue-login-app/pwa-512x512.png', // 使用絕對路徑包含 base
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    }
    ]
  },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif}'], // 添加全局匹配模式
        navigateFallback: null, // 禁用導航後備
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith('/api');
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // 緩存 Google Sheets API 請求
            urlPattern: ({ url }) => {
              return url.hostname.includes('script.google.com');
            },
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-api-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24, // 24小時
                maxEntries: 50
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // 緩存靜態資源
            urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|gif|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30天
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // GitHub Pages 部署設置
  base: process.env.NODE_ENV === 'production' ? '/vue-login-app/' : '/'
})
