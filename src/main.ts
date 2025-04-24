import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// PWA
import { initInstallPrompt } from './services/pwaService'
import { initOfflineDetection } from './services/offlineService'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')

// 初始化 PWA 安裝提示
initInstallPrompt()

// 初始化離線檢測
initOfflineDetection()