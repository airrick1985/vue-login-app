import { ref, Ref } from 'vue'
import { AuthResult, User } from '../types'

// 離線狀態追蹤
export const isOffline: Ref<boolean> = ref(false)

// 初始化離線檢測
export const initOfflineDetection = (): void => {
  // 檢查初始網絡狀態
  isOffline.value = !navigator.onLine
  
  // 監聽網絡狀態變化
  window.addEventListener('online', () => {
    isOffline.value = false
  })
  
  window.addEventListener('offline', () => {
    isOffline.value = true
  })
}

// 嘗試離線登入
export async function tryOfflineLogin(username: string, password: string): Promise<AuthResult> {
  try {
    // 從離線存儲中獲取用戶憑證
    const offlineCredentials = localStorage.getItem('offlineCredentials')
    
    if (!offlineCredentials) {
      return {
        success: false,
        message: '離線模式下無法驗證用戶，請連接網絡後重試'
      }
    }
    
    const credentials = JSON.parse(offlineCredentials) as Record<string, string>
    
    // 檢查用戶名和密碼
    if (credentials[username] === password) {
      return { 
        success: true,
        user: { name: username }
      }
    }
    
    return {
      success: false,
      message: '用戶名或密碼錯誤'
    }
  } catch (error) {
    console.error('離線登入時發生錯誤:', error)
    return {
      success: false,
      message: '離線登入時發生錯誤'
    }
  }
}

// 保存成功登入的憑證用於離線使用
export function saveOfflineCredentials(username: string, password: string): void {
  try {
    // 獲取現有的離線憑證
    const existingCredentials = localStorage.getItem('offlineCredentials')
    let credentials: Record<string, string> = {}
    
    if (existingCredentials) {
      credentials = JSON.parse(existingCredentials)
    }
    
    // 添加或更新憑證
    credentials[username] = password
    
    // 保存回本地存儲
    localStorage.setItem('offlineCredentials', JSON.stringify(credentials))
  } catch (error) {
    console.error('保存離線憑證時發生錯誤:', error)
  }
}