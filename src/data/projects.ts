// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

// 專案資料：新增專案就在陣列裡加一個 { ... } 區塊，欄位見上面的 Project
// 有介紹頁的專案：在 src/content/projects/<id>/index.md 寫內容，卡片會自動出現「專案介紹」按鈕
export const projectsData: Project[] = [
	{
		id: "dreamstrikers",
		title: "DreamStrikers",
		description:
			"受《火影忍者 終極風暴》與《Jump Force》啟發的 3D 對戰格鬥遊戲，支援本機、街機、練習與 Steam 線上房間對戰。",
		image: "assets/projects/dreamstrikers/cover.webp",
		category: "遊戲",
		techStack: ["Unreal Engine 5", "C++", "Blueprint", "StateTree", "Steam 線上"],
		status: "in-progress",
		visitUrl: "https://store.steampowered.com/app/3183230/_/",
		startDate: "2024-09-01",
		featured: true,
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
