import axios from 'axios'
import { AuthResult } from '../types'

// 使用環境變數存儲 GAS Web API URL，如果未設置則使用默認值
const GAS_API_URL = import.meta.env.VITE_GAS_API_URL || 
                    'https://script.google.com/macros/s/AKfycbxqy7CyW-vEzvSIrxT9e8pA9ihCPTmKcHFe1SRORCYCbRMg0P9VBv0uP4KHVNX2rdmM/exec';

/**
 * 從 Google Apps Script Web API 驗證用戶
 * @param username 用戶名
 * @param password 密碼
 * @returns Promise<AuthResult> 驗證結果
 */
export async function validateUser(username: string, password: string): Promise<AuthResult> {
  try {
    console.log('正在使用 GAS API URL:', GAS_API_URL);
    
    // 構建 API 請求 URL 與參數
    const params = new URLSearchParams({
      action: 'login',
      username,
      password
    });
    
    const apiUrl = `${GAS_API_URL}?${params.toString()}`;
    
    // 發送請求到 GAS Web API
    const response = await axios.get(apiUrl);
    
    // 檢查 API 響應
    if (response.data && typeof response.data === 'object') {
      return response.data as AuthResult;
    }
    
    // 如果響應格式不符合預期
    console.error('API 響應格式不符合預期:', response.data);
    return {
      success: false,
      message: 'API 響應異常，請稍後再試'
    };
    
  } catch (error) {
    // 捕獲並處理錯誤
    console.error('驗證用戶時發生錯誤:', error);
    
    // 檢查是否為網絡錯誤
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        return {
          success: false,
          message: '無法連接到驗證服務，請檢查網絡連接'
        };
      }
      
      const statusCode = error.response.status;
      
      if (statusCode === 403) {
        return {
          success: false,
          message: 'API 訪問被拒絕，請聯繫管理員'
        };
      } else if (statusCode === 404) {
        return {
          success: false,
          message: 'API 端點不存在，請檢查配置'
        };
      }
    }
    
    return {
      success: false,
      message: '驗證過程中發生錯誤，請稍後再試'
    };
  }
}

/**
 * 測試 GAS API 連接
 * @returns Promise<{success: boolean, message: string}>
 */
export async function testApiConnection(): Promise<{success: boolean, message: string, data?: any}> {
  try {
    // 使用固定的 API URL
    const apiUrl = GAS_API_URL;
    
    // 發送 ping 請求檢查 API 是否正常運行
    const response = await axios.get(`${apiUrl}?action=ping`);
    
    return {
      success: true,
      message: 'API 連接成功',
      data: response.data
    };
    
  } catch (error) {
    console.error('測試 API 連接時發生錯誤:', error);
    
    let errorMessage = 'API 連接失敗';
    
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        errorMessage = '無法連接到 API 服務，請檢查 URL 是否正確';
      } else {
        errorMessage = `API 錯誤 (${error.response.status}): ${error.message}`;
      }
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
}

// 模擬驗證 (開發階段使用)
export async function mockValidateUser(username: string, password: string): Promise<AuthResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === '測試用戶') {
        if (password === '123456') {
          resolve({ success: true, message: '登入成功', user: { name: username } });
        } else {
          resolve({ success: false, message: '密碼錯誤，請重新輸入' });
        }
      } else {
        resolve({
          success: false,
          message: '您的姓名不可使用，請與管理人員聯繫'
        });
      }
    }, 500); // 模擬網絡延遲
  });
}