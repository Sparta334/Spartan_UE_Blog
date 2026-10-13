import type { TimelineItem } from "../components/features/timeline/types";

// 時間線資料：新增一筆就複製一個 { ... } 區塊，依日期由新到舊排列
// 專案經歷請填 status（專案現狀）；遊戲連結的 type 用 "game"，會顯示成綠色的「遊戲連結」按鈕
export const timelineData: TimelineItem[] = [
	{
		id: "dreamstrikers",
		title: "畢業製作：DreamStrikers",
		description:
			"受到萬代南夢宮旗下格鬥作品《火影忍者 終極風暴》系列與《Jump Force》啟發，試著製作一款可以輕鬆上手的 3D 格鬥動作遊戲。",
		status: "獨立製作中，目前僅推出 Demo，但是規劃未來轉免費遊玩",
		type: "project",
		startDate: "2024-09-01",
		organization: "獨立製作",
		skills: ["Unreal Engine", "3D 格鬥動作"],
		achievements: [
			"Epic MegaGrants 評選，獲得 1 萬美元資助",
			"台灣放視大賞 優選獎",
			"台灣原創遊戲大賞 優勝",
			"青春設計節 評審團獎",
		],
		links: [
			{
				name: "DreamStrikers Steam 頁面",
				url: "https://store.steampowered.com/app/3183230/_/",
				type: "game",
			},
			{
				name: "Epic MegaGrants 2025",
				url: "https://www.unrealengine.com/news/epic-megagrants-2025-recap-first-submissions-are-now-open",
				type: "certificate",
			},
			{ name: "放視大賞", url: "https://www.vgwtw.com/about/", type: "certificate" },
			{
				name: "台灣原創遊戲大賞",
				url: "https://www.tgipa.org.tw/works/2025/work3.html",
				type: "certificate",
			},
			{ name: "青春設計節", url: "https://ydf.khcc.gov.tw/action/309", type: "certificate" },
		],
		icon: "material-symbols:sports-esports",
		featured: true,
	},
	{
		id: "ntue-dtd",
		title: "國立臺北教育大學 數位科技設計學系",
		description:
			"前期以 Unity 研究、理解遊戲引擎概念，後期使用 Unreal Engine，以完成或自行發行遊戲作為畢業前的最終目標。",
		type: "education",
		startDate: "2022-09-01",
		endDate: "2025-06-30",
		organization: "國立臺北教育大學",
		skills: ["Unity", "Unreal Engine", "遊戲設計"],
		achievements: [
			"自營遊戲開發社團繼任社長，舉辦多場校內 GameJam 與一次校外 GameJam",
			"畢業製作榮獲國內外獎項與評選",
		],
		icon: "material-symbols:school",
	},
];
