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
| `/admin` | 同源商家後台入口；預約管理為 `/admin#/calendar` |
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
STUDIO_ADMIN_URL=http://127.0.0.1:8080
```

這些設定只在伺服器讀取；部署時也需設定。STUDIO_ADMIN_URL 用於 rewrites，變更後需要重新 build／重啟網站。經 AndyStudio nginx 可用 `http://127.0.0.1:8080/api`。正式環境請設定實際可達的 API 網址與商家 slug；容器內的 localhost 指向該容器自身。不得放入管理員 token 或使用 `NEXT_PUBLIC_` 暴露設定。需要 Next.js Node.js server，不能僅匯出靜態檔案部署。

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

使用已啟動的獨立 `studio_e2e_*` Compose 測試環境，不連正式環境。準備程序會驗證容器與 API port 一致，再新增隨機命名測試商家、課程、老師與排班；原有商家不變。測試帳號使用 `example.test`，預設憑證只在準備程序記憶體中；若需手動驗收，可依下節將 owner 帳密保存至 ignored 本機設定檔，platform 帳密與 token 不會保存。

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

## 同源前台／商家後台

- 前台：`http://127.0.0.1:3001/`；頁尾「商家後台」連到 `/admin`。
- 後台：`http://127.0.0.1:3001/admin`；上方「返回網站」回到前台。
- 後台服務：`/admin#/services`；老師／排班：`/admin#/staff`；行事曆：`/admin#/calendar`。
- `/admin` 讀取現有商家後台 HTML，僅在 React root 外加入導覽連結，保留上游 CSP 與禁止 iframe 的安全標頭。
- 後台既有 `/assets/*`、`/logo.jpg` 與 `/api/*` 透過 Next rewrites 連至 STUDIO_ADMIN_URL。這些路徑保留給後台；前台 `/api/booking/*` 優先使用既有公開預約處理器。
- 登入、refresh、登出 cookie 維持後端的 HttpOnly／SameSite 與 `/api/auth` path；沒有將登入 token 放入導覽網址。STUDIO_API_URL 與 STUDIO_ADMIN_URL 必須連到同一組 AndyStudio API／資料庫。
- 既有忘記密碼信依後端 APP_URLS 開啟原本的後台（本機 8080）；本次未改全域寄信網址或密碼重設流程。

### 建立手動驗收帳號

僅限隔離本機 `studio_e2e_*` 環境，使用未存在的 `.env*.local` 檔名，準備程序會拒絕覆寫既有帳密檔。

```bash
STUDIO_TEST_REPO=/path/to/AndyStudio \
STUDIO_TEST_COMPOSE_PROJECT=studio_e2e_example \
STUDIO_TEST_CREDENTIALS_FILE=.env.acceptance.local \
node scripts/prepare-live.mjs

E2E_LIVE_FIXTURE=docs/live-fixture.local.json \
E2E_ADMIN_CREDENTIALS=.env.acceptance.local \
npm run test:e2e
```

帳密只保存 owner 的 E2E_OWNER_EMAIL／E2E_OWNER_PASSWORD，檔案權限 0600、不提交 Git，也不寫進 docs／Checkpoint。owner 與 platform 使用不同隨機密碼。手動驗收時把 `.env.local` 的 STUDIO_TENANT_SLUG 設成 fixture 裡的 slug，再執行 `npm run dev`；既有設定請先備份。這是驗收商家，不是正式品牌資料。

驗收流程：前台 `/booking` 預約 → 保存管理碼 → 頁尾進入商家後台 → 用本機驗收帳號登入 → 行事曆選擇預約日期 → 開啟該筆預約並取消 → 返回網站 → `/booking/manage` 查詢「已取消」。另測重新整理後維持登入、登出後重新整理不再登入。後台資料由原 API 權限控管，新增 `/admin` 不會繞過登入。


## 商家管理文章與商品（CMS）

日誌、器物與首頁的對應區塊現由 AndyStudio 公開內容 API 提供。商家可在 `/admin` 的「文章」「商品」新增內容、上傳圖片與儲存草稿，再由 admin／owner 發布。既有 `src/data/posts.ts`、`src/data/products.ts` 示範資料保留供歷史參考，這些頁面已不再讀取其陣列；上方早期靜態內容說明不適用於已串接的文章與商品。

- 使用既有 `STUDIO_API_URL`、`STUDIO_TENANT_SLUG`、`STUDIO_ADMIN_URL`；API 需部署內容模組並啟用商家的 `storefront` 功能。
- 網址採後台填寫的 slug：`/journal/{slug}`、`/shop/{slug}`。只顯示已發布資料；草稿、下架或不存在內容回應找不到頁面。修改 slug 不自動轉址。
- 發布、修改與下架後重新載入即反映，不需每次重新部署；頁面為動態 SSR，資料請求不快取。
- Markdown 支援以空行分隔的段落、`#`／`##`／`###` 標題、`- ` 清單、`**粗體**` 與 HTTP(S) 連結。HTML 顯示為文字，不執行；相對連結與其他 URL scheme 顯示為文字。
- 商品價格沿用平台規則：TWD/JPY 整元、USD 分。商品目前為展示，購買按鈕明確顯示尚未開放，沒有購物車或金流。
- 圖片須先由後台驗證；第一張為封面，其餘依排序顯示。API 回傳短效簽章 URL，重新載入會取得新的 URL。
- 空清單、API 無法連線與不存在內容分別處理，不以示範資料掩蓋錯誤。預約與作品頁維持原有流程。

驗證：`npm run lint`、`npm run typecheck`、`npm test`、`npm run build`。跨專案真實瀏覽器驗收由 AndyStudio `scripts/test-content-live.cjs` 啟動，見該專案 README；`E2E_PORT` 可覆寫 Playwright 測試 port，避免佔用現行 3001。`e2e/content-live.spec.ts` 涵蓋圖片、發布／下架、HTML 注入防護、角色與手機版及真實預約回歸。
