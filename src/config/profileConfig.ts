import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "Spartan",
	bio: "研究 Unreal Engine 的開發者",
	typewriter: {
		enable: true, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/Sparta334",
		},
		{
			name: "Steam",
			icon: "fa7-brands:steam",
			url: "https://steamcommunity.com/profiles/76561198414738133/",
		},
	],
};
