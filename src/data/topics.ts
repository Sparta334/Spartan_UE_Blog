// Unreal 技术专题
// 文章 frontmatter 的 category 与专题的 name 相同，就会归入该专题

export interface Topic {
	id: string; // 用于网址 /topics/<id>/
	name: string; // 与文章 category 对应
	description: string;
	icon: string; // Iconify 图标名
}

export const topics: Topic[] = [
	{
		id: "ue-cpp",
		name: "UE C++",
		description: "反射系统、UObject 生命周期、模块与构建。",
		icon: "material-symbols:code",
	},
	{
		id: "gas",
		name: "GAS",
		description: "Gameplay Ability System：Ability、Effect、Attribute。",
		icon: "material-symbols:bolt",
	},
	{
		id: "multiplayer",
		name: "多人联机",
		description: "网络复制、RPC、预测与同步。",
		icon: "material-symbols:lan",
	},
	{
		id: "tools",
		name: "工具开发",
		description: "编辑器扩展、自动化与开发工具。",
		icon: "material-symbols:build",
	},
];

// 不属于以上专题的文章归入这里
export const otherTopic: Topic = {
	id: "other",
	name: "其他",
	description: "未归入专题的文章。",
	icon: "material-symbols:folder",
};
