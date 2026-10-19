# 微雨漫作 wayee handmade

手作工作室與小舖的官方網站。以 `docs/晴空 · 首頁-html` 的設計稿為基準，使用 **Next.js 16（App Router）+ MUI 9** 實作。

## 頁面

| 路徑 | 內容 |
| --- | --- |
| `/` | 首頁：直排標題 Hero、關於、作品、器物、預約、日誌 |
| `/works` | 作品：分類篩選、作品格狀列表、客製諮詢 |
| `/shop` | 器物：分類篩選、商品列表、購物須知 |
| `/shop/[id]` | 商品頁：圖片、規格、數量與加入購物袋 |
| `/booking` | 預約：服務說明、預約表單、常見問題 |
| `/journal` | 日誌：精選文章、標籤篩選、文章列表 |
| `/journal/[slug]` | 文章頁 |

> 購物袋、加入購物袋、預約表單與電子報訂閱目前**只有外觀**，尚未串接後端。

## 開發

需要 Node.js 20 以上。

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 正式建置（全部頁面靜態產生）
npm run start
npm run lint
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
- `services.ts` — 預約服務與常見問題
- `posts.ts` — 日誌文章

## 設計系統

設計稿的色彩、字體與斷點都集中在 `src/theme/theme.ts`：

- 色彩：`theme.palette.sky.*`（底色 `#E3EEF6`、文字 `#1E2833`、主色 `#2F4A63`、線條 `#B9CEDE`…），在 `sx` 中可寫成 `'sky.ink'`
- 字體：Noto Sans TC（內文）、Noto Serif TC（標題）、Cormorant Garamond（英文斜體）
- Typography 變體：`idx`（段落序號）、`en`（英文副標）、`sectionTitle`（區塊標題）
- 斷點：`sm` = 761px、`md` = 1001px，對應設計稿的 760px / 1000px
- MUI `Link` 與 `Button href` 預設使用 `next/link`
