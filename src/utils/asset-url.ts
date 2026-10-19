const REMOTE_ASSET_PATTERN = /^(?:https?:)?\/\//i;

// 圖片、音樂、影片等靜態檔案只放一份在網站根目錄，英文版（base 是 /en/）直接共用
// 開發伺服器（pnpm dev:en）只在自己的 base 底下提供檔案，所以開發時照用 BASE_URL
export const ASSET_BASE: string = import.meta.env?.DEV
	? import.meta.env.BASE_URL
	: "/";

export function isRemoteAssetUrl(value: string): boolean {
	return (
		REMOTE_ASSET_PATTERN.test(value) ||
		value.startsWith("data:") ||
		value.startsWith("blob:")
	);
}

export function resolveAssetUrl(value: string): string {
	if (!value || isRemoteAssetUrl(value)) {
		return value;
	}
	// 網站部署在子路徑（例如 /Spartan_UE_Blog/）時，本地資源要加上 base 才找得到
	const base = ASSET_BASE.replace(/\/$/, "");
	if (value.startsWith("/")) {
		return base && !value.startsWith(`${base}/`) ? `${base}${value}` : value;
	}
	return `${base}/${value}`;
}
