<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    
    <!-- PWA 更新提示 -->
    <v-snackbar
      v-model="showUpdateSnackbar"
      :timeout="-1"
      color="info"
      bottom
    >
      有新版本可用！
      <template v-slot:actions>
        <v-btn
          color="white"
          text
          @click="refreshApp"
        >
          更新
        </v-btn>
      </template>
    </v-snackbar>
    
    <!-- PWA 離線就緒提示 -->
    <v-snackbar
      v-model="showOfflineSnackbar"
      :timeout="3000"
      color="success"
      bottom
    >
      應用程式已可離線使用！
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { updateAvailable, isPwaReady, updateSW } from './services/pwaService'

export default defineComponent({
  name: 'App',
  setup() {
    const showUpdateSnackbar = ref(false)
    const showOfflineSnackbar = ref(false)

    // 監聽 PWA 更新狀態
    watch(updateAvailable, (newVal) => {
      showUpdateSnackbar.value = newVal
    })

    // 監聽 PWA 就緒狀態
    watch(isPwaReady, (newVal) => {
      showOfflineSnackbar.value = newVal
    })

    // 更新應用程式
    const refreshApp = async () => {
      await updateSW()
      showUpdateSnackbar.value = false
    }

    return {
      showUpdateSnackbar,
      showOfflineSnackbar,
      refreshApp
    }
  }
})
</script>