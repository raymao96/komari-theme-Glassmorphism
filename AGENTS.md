# 專案開發規範

## 技術棧與工具

- 本專案是 Komari Monitor 主題，產物為可匯入的主題 ZIP。
- Vue 3、TypeScript、Vite 7；使用 Composition API 與 `<script setup lang="ts">`。
- 套件管理器為 Bun；`package.json` 指定 Bun 1.3.14、最低 Bun 1.2.0，Node.js 需求為 `^20.19.0 || >=22.12.0`。依賴版本以 `package.json` 為準。
- 狀態管理使用 Pinia，路由使用 Vue Router；樣式使用 Tailwind CSS v4，UI 使用 reka-ui 與 `src/components/ui/`，圖示使用 `@iconify/vue`。
- 圖表使用 ECharts / vue-echarts；地球視覺化使用 cobe、three、globe.gl。
- 不引入 Naive UI、UnoCSS、SCSS、`lucide-vue-next` 或其他圖示元件套件。

## 架構

- 依循 `Component → Composable → Service → RequestManager / CacheService → API / RPC`；入口與底層傳輸程式碼依現有分層處理。
- `src/components/`、`src/views/` 負責介面；`src/composables/` 負責響應式與生命週期；`src/services/` 負責業務與請求；`src/stores/` 管理狀態；`src/utils/` 存放工具與底層 API/RPC。
- 樣式及設計 token 位於 `src/styles/main.css`；優先沿用現有 UI 元件與 `@/` 匯入慣例。
- `public/images/` 的執行期檔名與路徑由程式依規則組合，變更時須同步更新引用。

## 指令

以下指令從專案根目錄執行：

```bash
bun install
bun run dev          # 開發伺服器
bun run lint         # ESLint，會自動修正並使用快取
bun run type-check   # vue-tsc 型別檢查
bun run build        # 型別檢查、建置與主題打包
bun run build-only   # 僅 Vite 建置與主題打包
bun run preview      # 預覽建置結果
```

`package.json` 另有 Playwright 視覺測試指令；執行須遵守全域禁止瀏覽器自動化的規定。原始碼變更通常執行 `bun run lint` 與 `bun run build`；純文件變更可略過。

## 版本與打包

- `komari-theme.json` 的 `version` 是發布版本唯一來源，不在 `package.json` 新增頂層 `version`。
- `bun run build` 產生 `dist/` 與 `komari-theme-Glassmorphism-build-<short-sha>.zip`。
- ZIP 頂層包含 `komari-theme.json`、`preview.png`、`dist/`；`preview.png` 來自 `docs/preview.png`。打包設定位於 `vite.config.ts`。
