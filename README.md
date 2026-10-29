# 微雨漫作 wayee handmade

手作工作室與小舖的官方網站。以 `docs/晴空 · 首頁-html` 的設計稿為基準，使用 **Next.js 16（App Router）+ MUI 9** 實作。

## 頁面

| 路徑 | 內容 |
| --- | --- |
| `/` | 首頁：直排標題 Hero、關於、作品、器物、預約、日誌 |
| `/works` | 作品：分類篩選、作品格狀列表、客製諮詢 |
| `/shop` | 器物：分類篩選、商品列表、購物須知 |
| `/shop/[id]` | 商品頁：圖片、規格、數量與加入購物袋 |
| `/booking` | 預約：API 服務資料、老師、可預約時段、建立預約、常見問題 |
| `/booking/manage` | 憑管理碼查詢與取消預約 |
| `/journal` | 日誌：精選文章、標籤篩選、文章列表 |
| `/journal/[slug]` | 文章頁 |

> 購物袋、加入購物袋與電子報訂閱目前**只有外觀**。預約已串接 AndyStudio 公開 API；正式啟用需要設定有效的商家 slug 與後端服務／老師排班。

## 開發

需要 Node.js 22.18 以上（包含 TypeScript 單元測試執行支援）。

```bash
npm ci
cp .env.example .env.local  # 首次設定；已有檔案時請直接編輯，避免覆蓋
npm run dev      # http://localhost:3001，避免與 API 的 3000 埠衝突
npm run build    # 頁面預先產生；API 代理需 Node.js 執行環境
npm run start
npm run lint
npm run typecheck
npm test
npm run test:e2e # 受控瀏覽器情境；真實 API 驗收見下方
```

## 專案結構

```
src/
├── app/            # 路由（App Router）
├── components/     # 共用元件；home/ works/ shop/ booking/ journal/ 為各頁專用
├── data/           # 網站內容（目前為佔位文字）
└── theme/          # MUI theme 與字體
public/images/      # logo 與首頁主視覺
docs/               # 原始設計稿（參考用）
```

## 修改內容

文案、作品、商品、課程與文章都在 `src/data/`，把 `[ ]` 佔位文字換成正式內容即可：

- `site.ts` — 店名、地址、營業時間、社群連結、導覽列
- `works.ts` — 作品與分類
- `products.ts` / `shopInfo.ts` — 商品、分類、購物須知
- `services.ts` — 常見問題與保留的舊版服務範例；首頁與預約頁的服務改由 API 取得
- `posts.ts` — 日誌文章

## 設計系統

設計稿的色彩、字體與斷點都集中在 `src/theme/theme.ts`：

- 色彩：`theme.palette.sky.*`（底色 `#E3EEF6`、文字 `#1E2833`、主色 `#2F4A63`、線條 `#B9CEDE`…），在 `sx` 中可寫成 `'sky.ink'`
- 字體：Noto Sans TC（內文）、Noto Serif TC（標題）、Cormorant Garamond（英文斜體）
- Typography 變體：`idx`（段落序號）、`en`（英文副標）、`sectionTitle`（區塊標題）
- 斷點：`sm` = 761px、`md` = 1001px，對應設計稿的 760px / 1000px
- MUI `Link` 與 `Button href` 預設使用 `next/link`

## 預約 API 設定

`.env.local`（不可提交）：

```dotenv
STUDIO_API_URL=http://127.0.0.1:3000
STUDIO_TENANT_SLUG=wayee
```

這兩項只在伺服器讀取；部署時也需設定，變更後重啟網站。經 AndyStudio nginx 可用 `http://127.0.0.1:8080/api`。正式環境請設定實際可達的 API 網址與商家 slug；容器內的 localhost 指向該容器自身。不得放入管理員 token 或使用 `NEXT_PUBLIC_` 暴露設定。需要 Next.js Node.js server，不能僅匯出靜態檔案部署。

先確認 `GET {STUDIO_API_URL}/public/{STUDIO_TENANT_SLUG}` 回應成功。商家須啟用 booking 功能、至少一個啟用服務與提供該服務的老師，並設定老師工作時段。404 可能代表商家不存在、停用或未啟用 booking；空時段也可能是排班、休假、提前時間或衝突造成。

| 網站同源路徑 | AndyStudio 公開端點 | 方法 |
| --- | --- | --- |
| `/api/booking/studio` | `/public/:slug` | GET |
| `/api/booking/services` | `/public/:slug/services` | GET |
| `/api/booking/staff` | `/public/:slug/staff` | GET |
| `/api/booking/availability` | `/public/:slug/availability` | GET |
| `/api/booking/bookings` | `/public/:slug/bookings` | POST |
| `/api/booking/manage` | `/public/:slug/manage` | POST |
| `/api/booking/manage/cancel` | `/public/:slug/manage/cancel` | POST |

- 預約時間使用 API 提供的 UTC start，畫面採商家時區；TWD／JPY 為整數元，其他支援幣別以兩位 minor unit 換算。
- 人數只寫入 note，不會預留團體容量或乘算價格；團體名額與費用須工作室確認。
- 取得管理碼後請使用者自行保存。管理碼只存在頁面記憶體與 POST body，不寫入網址、localStorage 或 sessionStorage；預約結束後後端拒絕查詢。
- 409 會刷新時段；建立預約不自動重試。網路／伺服器錯誤可能發生在預約已成立之後，畫面會提示先聯絡工作室確認，避免重複預約。
- 代理限制固定端點與參數，使用 no-store，不轉送 cookie／Authorization 或用戶端任意指定的 IP headers。
- **目前代理的限流限制**：後端會將此代理視為同一來源 IP。現行後端限制該 IP 對每個商家每小時建立預約 10 次、管理操作 30 次（失敗亦計次）。正式大量使用前需另外規劃可信 ingress 的真實 IP 傳遞與後端 trust proxy 設定；不可直接信任瀏覽器提供的 X-Forwarded-For。本次未修改後端限流。
- 此公開服務 API 尚未提供課程圖片欄位，因此保留原版面圖片佔位。商品／作品／日誌 API 與 Instagram 內容匯入不在此次串接範圍。

## 真實 API 驗收

使用已啟動的獨立 `studio_e2e_*` Compose 測試環境，不連正式環境。準備程序會驗證容器與 API port 一致，再新增隨機命名測試商家、課程、老師與排班；原有商家不變。測試帳號使用 `example.test`，憑證只在準備程序記憶體中。

```bash
STUDIO_TEST_REPO=/path/to/AndyStudio \
STUDIO_TEST_COMPOSE_PROJECT=studio_e2e_example \
STUDIO_TEST_API_URL=http://127.0.0.1:3000 \
node scripts/prepare-live.mjs

E2E_LIVE_FIXTURE=docs/live-fixture.local.json npm run test:e2e
```

Playwright 自行啟動 3001 網站，透過程序環境指向測試商家，不覆寫 `.env.local`。真實情境驗證首頁服務、手機預約、另一位顧客搶走時段的 409、重新選擇、管理碼查詢及取消。測試預約完成後取消；測試商家／測試帳號保留在隔離環境供追查。不要對同一 fixture 無限重跑，會達到後端限流；必要時重新建立 fixture。測試不保存含管理碼的 screenshot 或 trace。

## 回復方式

合併前可直接保留本分支供審查；合併後如需回復，由使用者核准後以 revert 還原此次功能提交。此變更沒有資料庫 migration；`.env.local` 是本機設定，不在 Git revert 範圍。回復網站程式不會刪除已建立的後端預約。
