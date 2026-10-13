import type { AnnouncementConfig } from "../types/config";

// 公告栏配置
export const announcementConfig: AnnouncementConfig = {
	title: "", // 公告标题，填空使用i18n字符串Key.announcement
	content: "歡迎來到我的 Unreal 技術筆記！", // 公告内容
	closable: true, // 允许用户关闭公告
	link: {
		enable: true, // 启用链接
		text: "關於我", // 链接文本
		url: "/about/", // 链接 URL
		external: false, // 内部链接
	},
};
