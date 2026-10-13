// 个人资料：首页资料区、关于我页面共用
// 留空的字段会在页面上显示为「待填写」，不会编造内容

export interface ProfileLink {
	name: string;
	icon: string; // Iconify 图标名
	url: string; // 留空 = 待填写
}

export const profile = {
	name: "Spartan",
	// 相对于 /src 的头像路径
	avatar: "assets/images/avatar.webp",
	title: "Unreal Engine 开发者",
	bio: "记录研究过、写过的 Unreal Engine 技术：UE C++、GAS、多人联机与工具开发。",
	// 个人页横幅（低饱和游戏场景 / 建筑空间 / 工作室画面），放在 public/ 下，例如 "/images/profile-banner.webp"
	// 留空时使用纯色占位
	banner: "/images/profile-banner.webp",
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
	] satisfies ProfileLink[],
};
