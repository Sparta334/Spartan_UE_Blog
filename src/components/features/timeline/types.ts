export interface TimelineLink {
	name: string;
	url: string;
	type: "website" | "certificate" | "project" | "game" | "other"; // game：遊戲連結，會用不同顏色的按鈕顯示
}

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	status?: string; // 專案現狀，專案經歷都建議填寫
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string;
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: TimelineLink[];
	icon?: string;
	color?: string;
	featured?: boolean;
}

export interface TimelineCardProps {
	item: TimelineItem;
	maxSkills?: number;
}
