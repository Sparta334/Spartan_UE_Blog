import path from "node:path";

import { ASSET_BASE } from "./asset-url";

const imageFiles = import.meta.glob<ImageMetadata>(
	"../**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
	{ import: "default" },
);

function normalizeKey(value: string): string {
	return value.replace(/\\/g, "/");
}

export function isRemoteImageSource(src: string): boolean {
	return /^(?:https?:)?\/\//.test(src) || src.startsWith("data:");
}

export function publicImageUrl(src: string): string {
	if (isRemoteImageSource(src)) return src;
	if (!src.startsWith("/")) return src;
	// 靜態檔案共用根目錄那一份（見 asset-url.ts 的 ASSET_BASE）
	const base = ASSET_BASE.replace(/\/$/, "");
	return `${base}${src}` || "/";
}

export async function resolveImageMetadata(
	src: string,
	basePath = "/",
): Promise<ImageMetadata | undefined> {
	if (isRemoteImageSource(src)) return undefined;

	const key = src.startsWith("/")
		? `../assets/public/${src.replace(/^\/+/, "")}`
		: `../${path.posix.join(basePath.replace(/^\/+/, ""), src)}`;
	const loader = imageFiles[normalizeKey(path.posix.normalize(key))];

	return loader ? await loader() : undefined;
}
