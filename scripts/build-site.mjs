// 建置繁中與英文兩個版本：繁中版輸出到 dist/，英文版輸出到 dist/en/
// 用 Node 設環境變數，Windows 與 Linux 都能直接跑
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });

for (const lang of ["zh_TW", "en"]) {
	const outDir = lang === "en" ? "dist/en" : "dist";
	const env = { ...process.env, PUBLIC_SITE_LANG: lang };
	console.log(`\n[build-site] ${lang} -> ${outDir}`);
	execSync("astro build", { stdio: "inherit", env });
	// 每個語言各自一份搜尋索引，搜尋框只會找到同語言的文章
	execSync(`pagefind --site ${outDir}`, { stdio: "inherit", env });
}
