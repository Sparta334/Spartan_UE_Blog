// Steam 全成就展示櫃：手動維護，不依賴 Steam API
// appId 可以在 Steam 商店網址找到：store.steampowered.com/app/<appId>/
// cover 使用 Steam 商店的橫幅圖（460×215），可在商店 API 的 header_image 取得

export interface SteamGame {
	appId: number;
	name: string;
	unlocked: number; // 已解鎖成就數
	total: number; // 總成就數
	cover: string;
	completedAt?: string; // 達成全成就的日期，例如 "2025-08-01"（可省略）
}

export const steamProfileUrl =
	"https://steamcommunity.com/profiles/76561198414738133/";

export const steamGames: SteamGame[] = [
	{
		appId: 814380,
		name: "Sekiro™: Shadows Die Twice",
		unlocked: 34,
		total: 34,
		cover:
			"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg",
	},
	{
		appId: 3669870,
		name: "控制：共振",
		unlocked: 49,
		total: 49,
		cover:
			"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3669870/918498496cb30b36cec93ebad589b132ddac8379/header_tchinese.jpg",
	},
	{
		appId: 2050650,
		name: "Resident Evil 4",
		unlocked: 46,
		total: 46,
		cover:
			"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg",
	},
	{
		appId: 1903340,
		name: "光與影：33號遠征隊",
		unlocked: 55,
		total: 55,
		cover:
			"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1903340/39a470b18702cf10380d193ec217f1aba722566e/header_tchinese.jpg",
	},
	{
		appId: 1593500,
		name: "God of War",
		unlocked: 37,
		total: 37,
		cover:
			"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg",
	},
	{
		appId: 1809540,
		name: "九日",
		unlocked: 35,
		total: 35,
		cover:
			"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1809540/header.jpg",
	},
];

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
