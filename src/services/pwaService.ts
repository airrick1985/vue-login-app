import { ref, Ref } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import { BeforeInstallPromptEvent } from '../types'

export const isPwaReady: Ref<boolean> = ref(false)
export const updateAvailable: Ref<boolean> = ref(false)
export const installPrompt: Ref<BeforeInstallPromptEvent | null> = ref(null)

// 註冊 Service Worker
export const updateSW = registerSW({
  onNeedRefresh() {
    updateAvailable.value = true
  },
  onOfflineReady() {
    isPwaReady.value = true
  }
})

// 處理 PWA 安裝提示
export const initInstallPrompt = (): void => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止 Chrome 67 及更早版本自動顯示安裝提示
    e.preventDefault()
    // 保存事件以便稍後觸發
    installPrompt.value = e as BeforeInstallPromptEvent
  })
}

// 觸發安裝提示
export const promptInstall = async (): Promise<boolean> => {
  if (!installPrompt.value) {
    return false
  }
  
  // 顯示安裝提示
  await installPrompt.value.prompt()
  
  // 等待用戶的選擇
  const choiceResult = await installPrompt.value.userChoice
  
  // 清除提示引用
  installPrompt.value = null
  
  return choiceResult.outcome === 'accepted'
}

// 檢查應用是否已經安裝
export const isAppInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true
}