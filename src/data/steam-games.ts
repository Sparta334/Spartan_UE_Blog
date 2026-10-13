// Steam 全成就展示柜：手动维护，不依赖 Steam API
// appId 可以在 Steam 商店网址中找到：store.steampowered.com/app/<appId>/
// 封面默认使用 Steam 的商店横图（460×215），也可以用 cover 指定自己的图片

export interface SteamGame {
	appId: number;
	name: string;
	unlocked: number; // 已解锁成就数
	total: number; // 总成就数
	completedAt?: string; // 达成全成就的日期，例如 "2025-08-01"
	cover?: string; // 自定义封面（可选）
}

export const steamGames: SteamGame[] = [
	// 示例（复制后取消注释并填写真实数据）：
	// { appId: 1234567, name: "游戏名称", unlocked: 50, total: 50, completedAt: "2025-08-01" },
];

export function steamStoreUrl(game: SteamGame): string {
	return `https://store.steampowered.com/app/${game.appId}/`;
}

export function steamCoverUrl(game: SteamGame): string {
	return (
		game.cover ??
		`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`
	);
}

export function isPerfect(game: SteamGame): boolean {
	return game.total > 0 && game.unlocked >= game.total;
}
