<template>
    <v-container class="fill-height" fluid>
      <!-- API 測試對話框 -->
      <v-dialog v-model="showApiTest" max-width="600px">
        <GasApiTestComponent @close="showApiTest = false" @settingsSaved="handleApiSettingsSaved" />
      </v-dialog>
      
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="4" class="pa-6">
            <v-card-title class="text-center text-h5 font-weight-bold mb-4">
              登入系統
            </v-card-title>
  
            <v-form @submit.prevent="handleLogin" ref="loginForm">
              <v-text-field
                v-model="username"
                label="姓名"
                required
                :error-messages="usernameError"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                @input="usernameError = ''"
              ></v-text-field>
  
              <v-text-field
                v-model="password"
                label="密碼"
                type="password"
                required
                :error-messages="passwordError"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                @input="passwordError = ''"
              ></v-text-field>
  
              <v-card-actions class="pa-0 mt-4">
                <v-spacer></v-spacer>
                <v-btn 
                  type="submit" 
                  color="primary" 
                  block 
                  size="large"
                  :loading="loading"
                >
                  登入
                </v-btn>
              </v-card-actions>
            </v-form>
  
            <v-alert
              v-if="errorMessage"
              type="error"
              class="mt-4"
              density="compact"
            >
              {{ errorMessage }}
            </v-alert>
            
            <!-- PWA 安裝按鈕 -->
            <InstallPwaButton class="mt-4" />
            
            <!-- 離線模式指示 -->
            <v-alert
              v-if="isOffline"
              type="warning"
              class="mt-4"
              density="compact"
            >
              您目前處於離線模式。只能使用已緩存的帳戶登入。
            </v-alert>
            
            <!-- 管理員工具區域 -->
            <div class="admin-tools mt-6">
              <v-divider class="mb-4"></v-divider>
              <v-btn
                variant="text"
                color="grey"
                size="small"
                prepend-icon="mdi-cog"
                density="compact"
                @click="showApiTest = true"
              >
                API 設置
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { validateUser } from '../services/userService'
  import { isOffline, initOfflineDetection, tryOfflineLogin, saveOfflineCredentials } from '../services/offlineService'
  import InstallPwaButton from '../components/InstallPwaButton.vue'
  import GasApiTestComponent from '../components/GasApiTestComponent.vue'
  import { AuthResult } from '../types'
  
  export default defineComponent({
    name: 'LoginView',
    components: {
      InstallPwaButton,
      GasApiTestComponent
    },
    setup() {
      const router = useRouter()
      const username = ref('')
      const password = ref('')
      const usernameError = ref('')
      const passwordError = ref('')
      const errorMessage = ref('')
      const loading = ref(false)
      const networkStatus = ref({ offline: false })
      
      // API 測試相關
      const showApiTest = ref(false)
  
      const handleLogin = async (): Promise<void> => {
        // 清除之前的錯誤信息
        usernameError.value = ''
        passwordError.value = ''
        errorMessage.value = ''
        
        // 簡單的前端驗證
        if (!username.value.trim()) {
          usernameError.value = '姓名不能為空'
          return
        }
        
        if (!password.value) {
          passwordError.value = '密碼不能為空'
          return
        }
        
        try {
          loading.value = true
          
          let result: AuthResult
          
          // 檢查是否處於離線狀態
          if (isOffline.value) {
            // 嘗試離線登入
            result = await tryOfflineLogin(username.value, password.value)
          } else {
            // 正常在線驗證
            result = await validateUser(username.value, password.value)
            
            // 如果成功登入，保存憑證以供離線使用
            if (result.success) {
              saveOfflineCredentials(username.value, password.value)
            }
          }
          
          if (result.success) {
            // 存儲登入狀態
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('user', JSON.stringify({ name: username.value }))
            
            // 導航到首頁
            router.push('/home')
          } else {
            errorMessage.value = result.message || '登入失敗'
          }
        } catch (error) {
          console.error('登入發生錯誤:', error)
          errorMessage.value = '登入過程中發生錯誤，請稍後再試'
        } finally {
          loading.value = false
        }
      }
      
      // 處理 API 設置保存
      const handleApiSettingsSaved = (settings: { apiUrl: string }) => {
        console.log('API 設置已保存:', settings)
        
        // 可以在這裡設置全局 API URL 變數或進行其他操作
        if (settings.apiUrl) {
          // 保存完設置後關閉對話框
          showApiTest.value = false
          
          // 提示用戶設置已保存
          errorMessage.value = ''
        }
      }
  
      onMounted(() => {
        // 初始化離線檢測
        initOfflineDetection()
        
        // 更新網絡狀態引用
        networkStatus.offline = isOffline.value
        
        // 檢查是否已設置 API URL
        const apiUrl = localStorage.getItem('gasApiUrl') || import.meta.env.VITE_GAS_API_URL
        if (!apiUrl) {
          // 如果是開發者模式，自動顯示 API 設置對話框
          if (import.meta.env.DEV) {
            showApiTest.value = true
          }
        }
      })
  
      return {
        username,
        password,
        usernameError,
        passwordError,
        errorMessage,
        loading,
        handleLogin,
        isOffline,
        showApiTest,
        handleApiSettingsSaved
      }
    }
  })
  </script>
  
  <style scoped>
  .admin-tools {
    text-align: center;
    opacity: 0.7;
    transition: opacity 0.3s;
  }
  
  .admin-tools:hover {
    opacity: 1;
  }
  </style>