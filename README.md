# Vue + TypeScript 登入系統 PWA

這是一個基於 Vue 3 + TypeScript + Vite + Vuetify 構建的漸進式 Web 應用 (PWA)，具有登入功能，並支持從 Google Sheets 驗證用戶。

## 功能特點

- 用戶登入界面，連接 Google Sheets 數據源進行身份驗證
- 漸進式 Web 應用 (PWA) 支持，可安裝到移動設備主畫面
- 離線模式支持，即使沒有網絡連接也能登入
- 響應式設計，適配各種螢幕尺寸
- 基於 TypeScript，提供類型安全和更好的開發體驗

## 安裝與運行

### 前置需求

- Node.js 16+
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 開發模式運行

```bash
npm run dev
```

### 構建生產版本

```bash
npm run build
```

### 本地預覽生產版本

```bash
npm run preview
```

## 環境變數設置

創建 `.env.local` 文件並添加以下內容：

```
VITE_API_KEY=YOUR_GOOGLE_API_KEY
VITE_SHEET_ID=YOUR_GOOGLE_SHEET_ID
VITE_SHEET_NAME=YOUR_SHEET_NAME
```

## Google Sheets 設置

1. 您的 Google Sheet 應包含以下數據結構：
   - 列 C: 用戶姓名
   - 列 D: 密碼

2. 確保您的 Sheet 是公開的，或者您已正確設置了 API 訪問權限

## 部署到 GitHub Pages

1. 在您的 GitHub 倉庫中啟用 GitHub Pages
2. 設置 GitHub Pages 來源為 `gh-pages` 分支
3. 推送代碼到 `main` 分支，GitHub Actions 將自動部署到 GitHub Pages

## PWA 功能

- 應用可以通過移動設備瀏覽器安裝到主畫面
- 支持離線使用
- 自動更新通知
- 啟動畫面和圖標

## 技術棧

- Vue 3 (組合式 API)
- TypeScript
- Vite
- Vuetify 3
- Vue Router 4
- PWA (vite-plugin-pwa)
- Google Sheets API

## 授權

MIT