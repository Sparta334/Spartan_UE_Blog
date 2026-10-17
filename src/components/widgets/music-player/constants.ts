import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const DEFAULT_COVER_URL = "/favicon/favicon.ico";

// 封面使用 YouTube 影片縮圖，artist 標示來源
const ytCover = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const LOCAL_PLAYLIST: Song[] = [
	{
		id: 1,
		title: "三味線ロックの夜",
		artist: "Samurai Beat",
		cover: ytCover("To_1NZulJvE"),
		url: "assets/music/url/shamisen-rock-night.mp3",
		duration: 236,
	},
	{
		id: 2,
		title: "Bury the Light (Boss Edit)",
		artist: "Casey Edwards（惡魔獵人5）· Edit by I_Archidon",
		cover: ytCover("g_93xQfRjEI"),
		url: "assets/music/url/bury-the-light.mp3",
		duration: 337,
	},
	{
		id: 3,
		title: "Another World",
		artist: "控制：共振 原聲帶",
		cover: ytCover("scUUhl6Lv8Q"),
		url: "assets/music/url/another-world.mp3",
		duration: 191,
	},
	{
		id: 4,
		title: "Manalan Mailla",
		artist: "控制：共振 原聲帶",
		cover: ytCover("Qo8VOF3hmqE"),
		url: "assets/music/url/manalan-mailla.mp3",
		duration: 155,
	},
	{
		id: 5,
		title: "Beyond Light",
		artist: "Destiny 2: Beyond Light 原聲帶",
		cover: ytCover("FOo7On4XHV8"),
		url: "assets/music/url/beyond-light.mp3",
		duration: 202,
	},
	{
		id: 6,
		title: "Delicate Weapon",
		artist: "Grimes",
		cover: ytCover("KTJQiGRQS8Q"),
		url: "assets/music/url/delicate-weapon.mp3",
		duration: 230,
	},
	{
		id: 7,
		title: "Alicia",
		artist: "Lorien Testard",
		cover: ytCover("yakOBIoyoik"),
		url: "assets/music/url/alicia.mp3",
		duration: 170,
	},
];

export const DEFAULT_SONG: Song = {
	title: "Sample Song",
	artist: "Sample Artist",
	cover: DEFAULT_COVER_URL,
	url: "",
	duration: 0,
	id: 0,
};

export const DEFAULT_METING_API =
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
export const DEFAULT_METING_ID = "14164869977";
export const DEFAULT_METING_SERVER = "netease";
export const DEFAULT_METING_TYPE = "playlist";

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;
