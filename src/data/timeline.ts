import type { TimelineItem } from "../components/features/timeline/types";
import { byLang } from "../i18n/lang";

// 時間線資料：新增一筆就複製一個 { ... } 區塊，依日期由新到舊排列
// 專案經歷請填 status（專案現狀）；遊戲連結的 type 用 "game"，會顯示成綠色的「遊戲連結」按鈕
export const timelineData: TimelineItem[] = [
	{
		id: "animal-players",
		title: byLang({
			zh_TW: "動物玩家股份有限公司",
			en: "Gaming Animals Co., Ltd.",
		}),
		description: byLang({
			zh_TW:
				"在職參與公司內多個專案，依公司專案項目的人力分配調動，擔任過主程式、副程式與後期維護人員，主要處理 Unreal 相關專案。",
			en: "I work across several in-house projects and move between teams as staffing needs change. I've been lead programmer, second programmer and post-launch maintainer, mostly on Unreal projects.",
		}),
		type: "work",
		startDate: "2025-08-01",
		organization: byLang({
			zh_TW: "新創獨立遊戲公司",
			en: "Indie game startup",
		}),
		skills: ["Unreal Engine"],
		achievementsTitle: byLang({ zh_TW: "參與項目", en: "Projects" }),
		achievements: [
			byLang({
				zh_TW: "未公開項目(多人連線機甲空戰項目 日本IP)",
				en: "Unannounced project (multiplayer mech air-combat game, Japanese IP)",
			}),
			byLang({
				zh_TW:
					"未公開項目(一款斜俯視角、風格化的哥德式黑暗奇幻世界的類魂動作冒險遊戲)",
				en: "Unannounced project (a stylized, isometric soulslike action-adventure set in a Gothic dark-fantasy world)",
			}),
		],
		links: [
			{
				name: byLang({ zh_TW: "公司網站", en: "Company website" }),
				url: "https://jobsgame.tw/companies/335117",
				type: "website",
			},
		],
		icon: "material-symbols:work",
		logo: "assets/timeline/gaming-animals.webp",
		featured: true,
	},
	{
		id: "salvebringer-ninja",
		title: byLang({
			zh_TW: "極癒忍傳 / SalvebringerNinja",
			en: "SalvebringerNinja",
		}),
		description: byLang({
			zh_TW:
				"一款日式和風輕無雙 ARPG，玩法風格類似《閃亂神樂系列 / SENRAN KAGURA Series》，有爽快的雜兵戰，也有些許強度的 Boss 戰。",
			en: "A Japanese-style, light musou ARPG in the vein of the SENRAN KAGURA series, with satisfying fights against crowds of enemies and some challenging boss battles.",
		}),
		status: byLang({
			zh_TW:
				"目前已由發行商公布 Steam 頁面且附有 Demo，具體發售時間需諮詢發行商",
			en: "The publisher has launched the Steam page with a demo. Ask the publisher for the release date.",
		}),
		type: "project",
		startDate: "2025-10-22",
		organization: byLang({
			zh_TW: "發行商：芒果派對",
			en: "Publisher: Mango Party",
		}),
		links: [
			{
				name: byLang({
					zh_TW: "極癒忍傳 Steam 頁面",
					en: "SalvebringerNinja on Steam",
				}),
				url: "https://store.steampowered.com/app/3953390/_/",
				type: "game",
			},
			{
				name: byLang({
					zh_TW: "發行商：芒果派對",
					en: "Publisher: Mango Party",
				}),
				url: "https://store.steampowered.com/franchise/MangoParty?l=tchinese",
				type: "website",
			},
		],
		icon: "material-symbols:sports-esports",
		featured: true,
	},
	{
		id: "dreamstrikers",
		title: byLang({
			zh_TW: "畢業製作：DreamStrikers",
			en: "Graduation project: DreamStrikers",
		}),
		description: byLang({
			zh_TW:
				"受到萬代南夢宮旗下格鬥作品《火影忍者 終極風暴》系列與《Jump Force》啟發，試著製作一款可以輕鬆上手的 3D 格鬥動作遊戲。",
			en: "Inspired by Bandai Namco's fighting games, the Naruto: Ultimate Ninja Storm series and Jump Force, this is my attempt at an easy-to-pick-up 3D action fighting game.",
		}),
		status: byLang({
			zh_TW: "獨立製作中，目前僅推出 Demo，但是規劃未來轉免費遊玩",
			en: "In independent development. Only a demo is out so far, and the game is planned to go free-to-play.",
		}),
		type: "project",
		startDate: "2024-09-01",
		organization: byLang({ zh_TW: "獨立製作", en: "Independent" }),
		skills: [
			"Unreal Engine",
			byLang({ zh_TW: "3D 格鬥動作", en: "3D action fighting" }),
		],
		achievements: [
			byLang({
				zh_TW: "Epic MegaGrants 評選，獲得 1 萬美元資助",
				en: "Epic MegaGrants recipient, awarded US$10,000",
			}),
			byLang({
				zh_TW: "台灣放視大賞 優選獎",
				en: "Vision Get Wild (Taiwan): Merit Award",
			}),
			byLang({
				zh_TW: "台灣原創遊戲大賞 優勝",
				en: "Taiwan Original Game Awards: Winner",
			}),
			byLang({
				zh_TW: "青春設計節 評審團獎",
				en: "Youth Design Festival: Jury Award",
			}),
		],
		links: [
			{
				name: byLang({
					zh_TW: "DreamStrikers Steam 頁面",
					en: "DreamStrikers on Steam",
				}),
				url: "https://store.steampowered.com/app/3183230/_/",
				type: "game",
			},
			{
				name: "Epic MegaGrants 2025",
				url: "https://www.unrealengine.com/news/epic-megagrants-2025-recap-first-submissions-are-now-open",
				type: "certificate",
			},
			{
				name: byLang({ zh_TW: "放視大賞", en: "Vision Get Wild" }),
				url: "https://www.vgwtw.com/about/",
				type: "certificate",
			},
			{
				name: byLang({
					zh_TW: "台灣原創遊戲大賞",
					en: "Taiwan Original Game Awards",
				}),
				url: "https://www.tgipa.org.tw/works/2025/work3.html",
				type: "certificate",
			},
			{
				name: byLang({ zh_TW: "青春設計節", en: "Youth Design Festival" }),
				url: "https://ydf.khcc.gov.tw/action/309",
				type: "certificate",
			},
		],
		icon: "material-symbols:sports-esports",
		featured: true,
	},
	{
		id: "ntue-dtd",
		title: byLang({
			zh_TW: "國立臺北教育大學 數位科技設計學系",
			en: "National Taipei University of Education, Department of Digital Technology Design",
		}),
		description: byLang({
			zh_TW:
				"前期以 Unity 研究、理解遊戲引擎概念，後期使用 Unreal Engine，以完成或自行發行遊戲作為畢業前的最終目標。",
			en: "I started with Unity to learn how game engines work, then moved to Unreal Engine. My goal was to finish, or even self-publish, a game before graduating.",
		}),
		type: "education",
		startDate: "2022-09-01",
		endDate: "2025-06-30",
		organization: byLang({
			zh_TW: "國立臺北教育大學",
			en: "National Taipei University of Education",
		}),
		skills: [
			"Unity",
			"Unreal Engine",
			byLang({ zh_TW: "遊戲設計", en: "Game design" }),
		],
		achievements: [
			byLang({
				zh_TW:
					"自營遊戲開發社團繼任社長，舉辦多場校內 GameJam 與一次校外 GameJam",
				en: "Took over as president of the student-run game development club and organized several on-campus game jams and one off-campus game jam",
			}),
			byLang({
				zh_TW: "畢業製作榮獲國內外獎項與評選",
				en: "Graduation project won awards and selections in Taiwan and abroad",
			}),
		],
		icon: "material-symbols:school",
	},
];
