<template>
    <v-card class="ma-4 pa-4">
      <v-card-title>GAS Web API 連接測試</v-card-title>
      
      <v-card-text>
        <v-alert
          v-if="testResult"
          :type="testResult.success ? 'success' : 'error'"
          class="mb-4"
          density="compact"
        >
          {{ testResult.message }}
        </v-alert>
        
        <v-text-field
          v-model="apiUrl"
          label="GAS Web API URL"
          placeholder="GAS Web 應用 URL"
          variant="outlined"
          :disabled="loading"
          hide-details
          class="mb-4"
        ></v-text-field>
        
        <v-btn
          color="primary"
          @click="testConnection"
          :loading="loading"
          block
        >
          測試連接
        </v-btn>
        
        <v-btn
          color="secondary"
          @click="resetToDefault"
          :disabled="loading"
          class="mt-2"
          block
          variant="outlined"
        >
          恢復默認 URL
        </v-btn>
      </v-card-text>
      
      <v-card-subtitle v-if="testResult && testResult.success">
        連接結果預覽：
      </v-card-subtitle>
      
      <v-card-text v-if="testResult && testResult.success && testResult.data">
        <pre class="response-preview">{{ JSON.stringify(testResult.data, null, 2) }}</pre>
      </v-card-text>
      
      <v-divider class="my-4"></v-divider>
      
      <v-card-title>測試驗證</v-card-title>
      
      <v-card-text>
        <v-text-field
          v-model="testUsername"
          label="測試用戶名"
          variant="outlined"
          :disabled="loading"
          hide-details
          class="mb-2"
        ></v-text-field>
        
        <v-text-field
          v-model="testPassword"
          label="測試密碼"
          type="password"
          variant="outlined"
          :disabled="loading"
          hide-details
          class="mb-4"
        ></v-text-field>
        
        <v-btn
          color="secondary"
          @click="testAuth"
          :loading="authLoading"
          :disabled="loading || !apiUrl"
          block
        >
          測試驗證
        </v-btn>
        
        <v-alert
          v-if="authResult"
          :type="authResult.success ? 'success' : 'error'"
          class="mt-4"
          density="compact"
        >
          {{ authResult.message }}
        </v-alert>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          @click="saveSettings"
          :disabled="!apiUrl"
        >
          保存設置
        </v-btn>
        <v-btn
          color="secondary"
          variant="text"
          @click="$emit('close')"
        >
          關閉
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import axios from 'axios'
  
  // 默認 GAS API URL
  const DEFAULT_GAS_API_URL = 'https://script.google.com/macros/s/AKfycbxqy7CyW-vEzvSIrxT9e8pA9ihCPTmKcHFe1SRORCYCbRMg0P9VBv0uP4KHVNX2rdmM/exec';
  
  export default defineComponent({
    name: 'GasApiTestComponent',
    emits: ['close', 'settingsSaved'],
    setup(props, { emit }) {
      const apiUrl = ref('')
      const loading = ref(false)
      const testResult = ref<{success: boolean, message: string, data?: any}|null>(null)
      
      // 測試驗證相關
      const testUsername = ref('')
      const testPassword = ref('')
      const authLoading = ref(false)
      const authResult = ref<{success: boolean, message: string, user?: any}|null>(null)
      
      onMounted(() => {
        // 獲取本地存儲的值或環境變數或默認值
        apiUrl.value = localStorage.getItem('gasApiUrl') || 
                       import.meta.env.VITE_GAS_API_URL || 
                       DEFAULT_GAS_API_URL;
      })
      
      const resetToDefault = () => {
        apiUrl.value = DEFAULT_GAS_API_URL;
        testResult.value = null;
      }
      
      const testConnection = async () => {
  if (!apiUrl.value) {
    testResult.value = {
      success: false,
      message: '請填寫 GAS Web API URL'
    }
    return
  }
  
  loading.value = true
  testResult.value = null
  
  try {
    // 使用 ping action 測試連接
    const response = await axios.get(`${apiUrl.value}?action=ping`)
    
    testResult.value = {
      success: true,
      message: 'API 連接成功！',
      data: response.data
    }
  } catch (error) {
    console.error('API 測試失敗:', error)
    let errorMessage = 'API 連接失敗'
    
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        errorMessage = '無法連接到 API，請檢查 URL 是否正確'
      } else {
        errorMessage = `API 錯誤 (${error.response.status}): ${error.message}`
      }
    }
    
    testResult.value = {
      success: false,
      message: errorMessage
    }
  } finally {
    loading.value = false
  }
}

const testAuth = async () => {
  if (!apiUrl.value || !testUsername.value || !testPassword.value) {
    authResult.value = {
      success: false,
      message: '請填寫所有必要欄位'
    }
    return
  }
  
  authLoading.value = true
  authResult.value = null
  
  try {
    // 構建參數
    const params = new URLSearchParams({
      action: 'login',
      username: testUsername.value,
      password: testPassword.value
    })
    
    // 發送驗證請求
    const response = await axios.get(`${apiUrl.value}?${params.toString()}`)
    
    authResult.value = response.data
  } catch (error) {
    console.error('驗證測試失敗:', error)
    
    authResult.value = {
      success: false,
      message: '驗證請求失敗，請檢查 API 設置和網絡連接'
    }
  } finally {
    authLoading.value = false
  }
}

const saveSettings = () => {
  // 保存 API URL 到本地存儲
  localStorage.setItem('gasApiUrl', apiUrl.value)
  
  // 通知父組件設置已保存
  emit('settingsSaved', { apiUrl: apiUrl.value })
}

return {
  apiUrl,
  loading,
  testResult,
  testConnection,
  resetToDefault,
  testUsername,
  testPassword,
  authLoading,
  authResult,
  testAuth,
  saveSettings
}
</script>

<style scoped>
.response-preview {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>