// Steam 全成就展示櫃的資料
// 資料在 steam-games.json：設定 STEAM_API_KEY 後，建置時會由 scripts/update-steam.mjs 從 Steam API 自動更新；
// 沒有金鑰時也可以直接手動編輯那個 JSON。

import games from "./steam-games.json";

export interface SteamGame {
	appId: number;
	name: string;
	unlocked: number; // 已解鎖成就數
	total: number; // 總成就數
	cover: string; // Steam 商店橫幅圖（460×215）
	completedAt?: string; // 達成全成就的日期，例如 "2025-08-01"
}

export const steamProfileUrl =
	"https://steamcommunity.com/profiles/76561198414738133/";

export const steamGames: SteamGame[] = games;

export function steamStoreUrl(game: SteamGame): string {
	return `https://store.steampowered.com/app/${game.appId}/`;
}

export const perfectGames = steamGames.filter(
	(g) => g.total > 0 && g.unlocked >= g.total,
);
export const totalPerfectAchievements = perfectGames.reduce(
	(sum, g) => sum + g.unlocked,
	0,
);
