// 用英文版跑開發伺服器（pnpm dev:en），網址是 http://localhost:3000/en/
import { execSync } from "node:child_process";

execSync("astro dev", {
	stdio: "inherit",
	env: { ...process.env, PUBLIC_SITE_LANG: "en" },
});
