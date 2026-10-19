// 網站語言：同一份程式碼建置兩次，繁中版放在網站根目錄，英文版放在 /en/
// 建置英文版時設環境變數 PUBLIC_SITE_LANG=en（見 package.json 的 build 指令）
// 這個檔案不能 import 其他設定檔，config 和 data 都會引用它

export type SiteLang = "zh_TW" | "en";

function readSiteLang(): SiteLang {
	// astro.config.mjs 載入時還沒有 import.meta.env，改讀 process.env
	const fromEnv =
		import.meta.env?.PUBLIC_SITE_LANG ??
		(typeof process !== "undefined" ? process.env.PUBLIC_SITE_LANG : undefined);
	return fromEnv === "en" ? "en" : "zh_TW";
}

export const SITE_LANG: SiteLang = readSiteLang();

// 每個語言版本在網站上的根路徑
export const LANG_BASES: Record<SiteLang, string> = {
	zh_TW: "/",
	en: "/en/",
};

// 依目前建置的語言挑一個值，例如 byLang({ zh_TW: "專案展示", en: "Projects" })
export function byLang<T>(values: Record<SiteLang, T>): T {
	return values[SITE_LANG];
}

// 訪客手動選過的語言存在 localStorage，自動導向會尊重這個選擇
export const LANG_STORAGE_KEY = "site-lang";

// 把某語言版本的網址路徑換成另一個語言的同一頁，例如 /posts/a/ -> /en/posts/a/
export function switchLangPath(
	pathname: string,
	from: SiteLang,
	to: SiteLang,
): string {
	const fromBase = LANG_BASES[from];
	const rest = pathname.startsWith(fromBase)
		? pathname.slice(fromBase.length)
		: pathname.replace(/^\//, "");
	return LANG_BASES[to] + rest;
}

// 圖片、音樂、影片等靜態檔案只放一份在網站根目錄，英文版直接共用，不另外複製
// 開發伺服器（pnpm dev:en）只在自己的 base 底下提供檔案，所以開發時照用 BASE_URL
export const ASSET_BASE: string = import.meta.env?.DEV
	? import.meta.env.BASE_URL
	: LANG_BASES.zh_TW;
