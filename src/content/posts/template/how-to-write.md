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

每篇文章是一個 Markdown 檔，放在 `src/content/posts/` 底下。可以用資料夾分類，圖片也可以放在同一個資料夾：

```text
src/content/posts/
├── ue-cpp/uproperty-cheatsheet.md
├── gas/gas-setup-notes.md
└── rendering/my-new-post/
    ├── index.md
    └── cover.webp
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
