const REMOTE_ASSET_PATTERN = /^(?:https?:)?\/\//i;

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
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	if (value.startsWith("/")) {
		return base && !value.startsWith(`${base}/`) ? `${base}${value}` : value;
	}
	return `${base}/${value}`;
}
