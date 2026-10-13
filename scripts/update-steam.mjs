// 從 Steam Web API 抓取全成就遊戲，寫入 src/data/steam-games.json
//
// 需要環境變數 STEAM_API_KEY（在 GitHub 儲存庫的 Secrets 設定，或本機的 .env）。
// 沒有金鑰或抓取失敗時，保留現有的 JSON，不會讓建置失敗。
// Steam 個人檔案的「遊戲詳細資料」必須設為公開，否則抓不到遊戲列表。

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadEnv } from "./load-env.js";

loadEnv();

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(rootDir, "src/data/steam-games.json");

const API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID || "76561198414738133";
// 測試時可以指向模擬伺服器
const API_BASE = process.env.STEAM_API_BASE || "https://api.steampowered.com";
const STORE_BASE = process.env.STEAM_STORE_BASE || "https://store.steampowered.com";
const LANG = "tchinese";
const CONCURRENCY = 6;

async function getJson(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}

async function mapLimit(items, limit, fn) {
	const results = new Array(items.length);
	let next = 0;
	async function worker() {
		while (next < items.length) {
			const i = next++;
			results[i] = await fn(items[i]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
	return results;
}

async function getOwnedGames() {
	const params = new URLSearchParams({
		key: API_KEY,
		steamid: STEAM_ID,
		include_appinfo: "1",
		include_played_free_games: "1",
		format: "json",
	});
	const data = await getJson(`${API_BASE}/IPlayerService/GetOwnedGames/v1/?${params}`);
	return data.response?.games ?? [];
}

// 回傳 { unlocked, total, completedAt } 或 null（遊戲沒有成就）
async function getAchievementProgress(appId) {
	const params = new URLSearchParams({
		key: API_KEY,
		steamid: STEAM_ID,
		appid: String(appId),
		l: LANG,
	});
	try {
		const data = await getJson(
			`${API_BASE}/ISteamUserStats/GetPlayerAchievements/v1/?${params}`,
		);
		const list = data.playerstats?.achievements;
		if (!data.playerstats?.success || !Array.isArray(list) || list.length === 0) {
			return null;
		}
		const achieved = list.filter((a) => a.achieved === 1);
		const lastUnlock = Math.max(0, ...achieved.map((a) => a.unlocktime || 0));
		return {
			unlocked: achieved.length,
			total: list.length,
			completedAt: lastUnlock ? new Date(lastUnlock * 1000).toISOString().slice(0, 10) : undefined,
		};
	} catch {
		// 沒有成就的遊戲會回傳 400，直接略過
		return null;
	}
}

// 商店資料：繁中名稱與橫幅圖（新遊戲的圖片網址帶有雜湊，不能自己拼）
async function getStoreInfo(appId) {
	try {
		const data = await getJson(`${STORE_BASE}/api/appdetails?appids=${appId}&l=${LANG}`);
		const info = data[appId]?.data;
		if (!info) return {};
		return { name: info.name, cover: info.header_image?.replace(/\?t=\d+$/, "") };
	} catch {
		return {};
	}
}

async function main() {
	if (!API_KEY) {
		console.log("[steam] 沒有設定 STEAM_API_KEY，保留現有的 steam-games.json");
		return;
	}

	const owned = await getOwnedGames();
	if (owned.length === 0) {
		console.log("[steam] 抓不到遊戲列表（個人檔案的遊戲詳細資料可能沒有公開），保留現有資料");
		return;
	}

	// 沒玩過的遊戲不可能有成就，略過以減少請求
	const played = owned.filter((g) => (g.playtime_forever ?? 0) > 0);
	console.log(`[steam] 共 ${owned.length} 款遊戲，檢查其中玩過的 ${played.length} 款`);

	const progress = await mapLimit(played, CONCURRENCY, (g) => getAchievementProgress(g.appid));
	const perfect = played
		.map((g, i) => ({ game: g, p: progress[i] }))
		.filter(({ p }) => p && p.total > 0 && p.unlocked >= p.total);

	const games = await mapLimit(perfect, CONCURRENCY, async ({ game, p }) => {
		const store = await getStoreInfo(game.appid);
		return {
			appId: game.appid,
			name: store.name || game.name,
			unlocked: p.unlocked,
			total: p.total,
			cover:
				store.cover ||
				`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`,
			...(p.completedAt && { completedAt: p.completedAt }),
		};
	});

	// 最近達成的排前面
	games.sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));

	await fs.writeFile(OUTPUT, `${JSON.stringify(games, null, "\t")}\n`);
	console.log(`[steam] 找到 ${games.length} 款全成就遊戲，已寫入 src/data/steam-games.json`);
}

main().catch((err) => {
	// 抓取失敗不影響建置，沿用現有資料
	console.warn(`[steam] 抓取失敗，保留現有資料：${err.message}`);
});
