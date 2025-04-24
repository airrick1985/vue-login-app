<template>
    <div class="install-container">
      <v-btn
        v-if="showInstallButton"
        color="primary"
        prepend-icon="mdi-cellphone-arrow-down"
        @click="handleInstall"
        :loading="installing"
      >
        安裝到主畫面
      </v-btn>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue'
  import { promptInstall, installPrompt, isAppInstalled } from '../services/pwaService'
  
  export default defineComponent({
    name: 'InstallPwaButton',
    setup() {
      const showInstallButton = ref(false)
      const installing = ref(false)
  
      // 檢查是否顯示安裝按鈕
      const checkInstallButton = (): void => {
        showInstallButton.value = !!installPrompt.value && !isAppInstalled()
      }
  
      // 處理安裝按鈕點擊
      const handleInstall = async (): Promise<void> => {
        installing.value = true
        try {
          await promptInstall()
        } catch (error) {
          console.error('安裝應用程式時發生錯誤:', error)
        } finally {
          checkInstallButton()
          installing.value = false
        }
      }
  
      onMounted(() => {
        checkInstallButton()
        
        // 監聽安裝提示變化
        watch(installPrompt, () => {
          checkInstallButton()
        })
      })
  
      return {
        showInstallButton,
        installing,
        handleInstall
      }
    }
  })
  </script>
  
  <style scoped>
  .install-container {
    margin: 16px 0;
  }
  </style>