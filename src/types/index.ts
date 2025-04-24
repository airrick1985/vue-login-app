// 用戶類型定義
export interface User {
    name: string;
    [key: string]: any;
  }
  
  // 認證結果類型定義
  export interface AuthResult {
    success: boolean;
    message?: string;
    user?: User;
  }
  
  // Google Sheets 響應類型定義
  export interface GoogleSheetsResponse {
    values: string[][];
    range: string;
    majorDimension: string;
  }
  
  // PWA 安裝提示事件類型定義
  export interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
  
  // 聲明全局 window 類型擴展
  declare global {
    interface Window {
      deferredPrompt?: BeforeInstallPromptEvent;
    }
  }