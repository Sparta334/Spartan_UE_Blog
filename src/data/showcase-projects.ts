// 代表项目：首页「代表项目」和 /projects/ 页面共用
// 图片放在 public/images/projects/ 下，例如 "/images/projects/my-game.webp"（建议 16:9）

export interface ShowcaseProject {
	id: string;
	title: string;
	summary: string;
	image?: string; // 留空时显示占位图
	tags: string[]; // 技术标签，例如 ["UE5", "C++", "GAS"]
	demo?: string; // 演示视频或试玩链接
	source?: string; // 源码链接
	period?: string; // 例如 "2025.03 - 2025.08"
	featured?: boolean; // 是否显示在首页
}

export const showcaseProjects: ShowcaseProject[] = [
	// 示例（复制后取消注释并填写真实内容）：
	// {
	// 	id: "my-project",
	// 	title: "项目名称",
	// 	summary: "一句话介绍项目和你负责的部分。",
	// 	image: "/images/projects/my-project.webp",
	// 	tags: ["UE5", "C++"],
	// 	source: "https://github.com/Sparta334/xxx",
	// 	featured: true,
	// },
];
