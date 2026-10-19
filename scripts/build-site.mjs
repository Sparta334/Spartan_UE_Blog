// 建置繁中與英文兩個版本：繁中版輸出到 dist/，英文版輸出到 dist/en/
// 用 Node 設環境變數，Windows 與 Linux 都能直接跑
import { execSync } from "node:child_process";
import {
	cpSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";

rmSync("dist", { recursive: true, force: true });

for (const lang of ["zh_TW", "en"]) {
	const outDir = lang === "en" ? "dist/en" : "dist";
	const env = { ...process.env, PUBLIC_SITE_LANG: lang };
	console.log(`\n[build-site] ${lang} -> ${outDir}`);
	execSync("astro build", { stdio: "inherit", env });
	// 每個語言各自一份搜尋索引，搜尋框只會找到同語言的文章
	execSync(`pagefind --site ${outDir}`, { stdio: "inherit", env });
}

// 英文版和繁中版共用檔案，不留重複的一份：
// - public/ 的圖片、音樂等：英文頁面本來就連到根目錄那一份，刪掉 dist/en 裡複製出來的
// - _astro/：英文頁面透過 assetsPrefix 連到 /_astro/，把英文版獨有的檔案併進去
for (const entry of readdirSync("public")) {
	rmSync(`dist/en/${entry}`, { recursive: true, force: true });
}
cpSync("dist/en/_astro", "dist/_astro", { recursive: true, force: false });
rmSync("dist/en/_astro", { recursive: true, force: true });
// Astro 的字型 preload 不吃 assetsPrefix，還是寫 /en/_astro/fonts/，改成根目錄那一份
for (const file of readdirSync("dist/en", { recursive: true, encoding: "utf8" })) {
	if (!file.endsWith(".html")) continue;
	const path = `dist/en/${file}`;
	const html = readFileSync(path, "utf8");
	writeFileSync(path, html.replaceAll("/en/_astro/", "/_astro/"));
}
