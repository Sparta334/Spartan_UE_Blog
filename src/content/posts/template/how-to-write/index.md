---
title: "如何新增一篇文章"
published: 2026-10-01
description: "這個部落格的寫作說明：檔案放哪裡、frontmatter 欄位、程式碼區塊與提示框語法。"
tags: [說明]
category: 網站說明
pinned: false
draft: true
---

## 檔案位置

一篇文章一個資料夾，放在 `src/content/posts/<分類資料夾>/<文章>/` 底下，文章內容寫在 `index.md`，圖片和影片跟它放在同一個資料夾：

```text
src/content/posts/
├── ue-cpp/uproperty-cheatsheet/
│   └── index.md
└── ue-cpp/axis-snap-movement/
    ├── index.md
    ├── setup_01_place.jpg
    └── demo_stairs.mp4
```

文章網址就是資料夾路徑，例如 `/posts/ue-cpp/axis-snap-movement/`。

## 圖片與影片

圖片用 Markdown 語法、相對路徑，建置時會自動壓縮成 webp；引號裡的文字會變成圖說：

```markdown
![替代文字](./setup_01_place.jpg "圖說")
```

影片用 HTML 的 `<video>`，同樣寫相對路徑，建置時會複製到文章網址旁邊：

```html
<video src="./demo_stairs.mp4" controls muted loop playsinline></video>
```

## Frontmatter

```yaml
---
title: "文章標題"
published: 2026-10-13
description: "列表上顯示的摘要"
image: "./cover.webp"   # 封面，可省略
tags: [UE5, Rendering]
category: Rendering
draft: false            # true 時不會發布
---
```

## 程式碼區塊

支援標題與行號標示：

```cpp title="Example.cpp" {3}
void AExample::BeginPlay()
{
	Super::BeginPlay();
}
```

## 提示框

```markdown
:::tip
小技巧
:::

:::warning
注意事項
:::
```

:::tip
在本機執行 `pnpm dev`，存檔後瀏覽器會自動更新。
:::
