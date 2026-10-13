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
// 額外要檢查的 appId（家庭共享、已下架等不在「擁有的遊戲」清單裡的遊戲）
const EXTRA_IDS_FILE = path.join(rootDir, "src/data/steam-extra-appids.json");
// 同步結果摘要（只有數量與 appId，沒有金鑰），部署後可在 /steam-sync.json 查看
const REPORT = path.join(rootDir, "public/steam-sync.json");

const API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID || "76561198414738133";
// 測試時可以指向模擬伺服器
const API_BASE = process.env.STEAM_API_BASE || "https://api.steampowered.com";
const STORE_BASE = process.env.STEAM_STORE_BASE || "https://store.steampowered.com";
const LANG = "tchinese";
const CONCURRENCY = 4;
const RETRIES = 4;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class HttpError extends Error {
	constructor(status) {
		super(`HTTP ${status}`);
		this.status = status;
	}
}

// 被限流（429）、伺服器錯誤或網路中斷時重試，其他錯誤直接丟出
async function getJson(url) {
	for (let attempt = 0; ; attempt++) {
		try {
			const res = await fetch(url);
			if (res.ok) return await res.json();
			if (res.status !== 429 && res.status < 500) throw new HttpError(res.status);
			if (attempt >= RETRIES) throw new HttpError(res.status);
		} catch (err) {
			if (err instanceof HttpError && (err.status !== 429 && err.status < 500)) throw err;
			if (attempt >= RETRIES) throw err;
		}
		await sleep(1000 * 2 ** attempt);
	}
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
		include_free_sub: "1",
		skip_unvetted_apps: "0",
		format: "json",
	});
	const data = await getJson(`${API_BASE}/IPlayerService/GetOwnedGames/v1/?${params}`);
	return data.response?.games ?? [];
}

// 回傳 { unlocked, total, completedAt }；遊戲沒有成就回傳 null；其他錯誤回傳 { error }
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
	} catch (err) {
		// 沒有成就的遊戲會回傳 400，直接略過
		if (err instanceof HttpError && err.status === 400) return null;
		return { error: err.message };
	}
}

async function readExtraIds() {
	try {
		const ids = JSON.parse(await fs.readFile(EXTRA_IDS_FILE, "utf8"));
		return Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];
	} catch {
		return [];
	}
}

// 公開個人檔案頁面上出現的 appId（展示欄裡的遊戲），補抓不在擁有清單裡的遊戲
async function getProfileAppIds() {
	try {
		const res = await fetch(`https://steamcommunity.com/profiles/${STEAM_ID}/?l=english`);
		if (!res.ok) return [];
		const html = await res.text();
		const ids = new Set();
		for (const m of html.matchAll(/(?:\/apps\/|\/app\/|data-appid=")(\d{3,8})/g)) ids.add(Number(m[1]));
		return [...ids];
	} catch {
		return [];
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

	// 不用遊玩時數篩選：離線或很舊的遊戲時數可能是 0 但有成就
	const candidates = new Map(owned.map((g) => [g.appid, g]));
	const extraIds = [...(await readExtraIds()), ...(await getProfileAppIds())];
	for (const id of extraIds) {
		if (!candidates.has(id)) candidates.set(id, { appid: id, name: "" });
	}
	const list = [...candidates.values()];
	console.log(`[steam] 擁有 ${owned.length} 款，加上額外 ${list.length - owned.length} 款，共檢查 ${list.length} 款`);

	const progress = await mapLimit(list, CONCURRENCY, (g) => getAchievementProgress(g.appid));
	const failed = list.filter((_, i) => progress[i]?.error).map((g) => g.appid);
	const perfect = list
		.map((g, i) => ({ game: g, p: progress[i] }))
		.filter(({ p }) => p && !p.error && p.total > 0 && p.unlocked >= p.total);
	if (failed.length) console.warn(`[steam] ${failed.length} 款查詢失敗：${failed.join(", ")}`);

	const games = await mapLimit(perfect, CONCURRENCY, async ({ game, p }) => {
		const store = await getStoreInfo(game.appid);
		return {
			appId: game.appid,
			name: store.name || game.name || `App ${game.appid}`,
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

	// 大量查詢失敗時（例如被限流）不要用不完整的資料蓋掉現有清單
	const existing = JSON.parse(await fs.readFile(OUTPUT, "utf8").catch(() => "[]"));
	const keepExisting = failed.length > 0 && games.length < existing.length;
	if (!keepExisting) await fs.writeFile(OUTPUT, `${JSON.stringify(games, null, "\t")}\n`);

	await fs.writeFile(
		REPORT,
		`${JSON.stringify(
			{
				updatedAt: new Date().toISOString(),
				owned: owned.length,
				checked: list.length,
				perfect: games.length,
				perfectAppIds: games.map((g) => g.appId),
				failedAppIds: failed,
				keptPreviousData: keepExisting,
			},
			null,
			"\t",
		)}\n`,
	);
	if (keepExisting) {
		console.warn(`[steam] 有查詢失敗且結果比現有少，保留現有資料`);
		return;
	}
	console.log(`[steam] 找到 ${games.length} 款全成就遊戲，已寫入 src/data/steam-games.json`);
}

main().catch((err) => {
	// 抓取失敗不影響建置，沿用現有資料
	console.warn(`[steam] 抓取失敗，保留現有資料：${err.message}`);
});
