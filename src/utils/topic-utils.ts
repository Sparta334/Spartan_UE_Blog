import type { CollectionEntry } from "astro:content";
import { getSortedPosts } from "@utils/content-utils";
import { formatDateToYYYYMMDD } from "@utils/date-utils";
import { getPostUrl, url } from "@utils/url-utils";

import { otherTopic, type Topic, topics } from "../data/topics";

export type Post = CollectionEntry<"posts">;

export interface TopicGroup {
	topic: Topic;
	posts: Post[]; // 专题内按发布时间由旧到新，便于按顺序阅读
}

export function topicOf(post: Post): Topic {
	return topics.find((t) => t.name === post.data.category) ?? otherTopic;
}

export function topicUrl(topic: Topic): string {
	return url(`/topics/${topic.id}/`);
}

export function postUrl(post: Post): string {
	return getPostUrl(post);
}

// 所有专题（包含没有文章的专题）；「其他」只在有文章时出现
export async function getTopicGroups(): Promise<TopicGroup[]> {
	const posts = await getSortedPosts();
	const groups = [...topics, otherTopic].map((topic) => ({
		topic,
		posts: posts
			.filter((p) => topicOf(p).id === topic.id)
			.sort((a, b) => a.data.published.getTime() - b.data.published.getTime()),
	}));
	return groups.filter((g) => g.topic.id !== otherTopic.id || g.posts.length > 0);
}

// 最新文章（按发布时间由新到旧）
export async function getLatestPosts(limit?: number): Promise<Post[]> {
	const posts = (await getSortedPosts()).sort(
		(a, b) => b.data.published.getTime() - a.data.published.getTime(),
	);
	return limit ? posts.slice(0, limit) : posts;
}

export function formatPostDate(post: Post, field: "published" | "updated" = "published"): string {
	const date = post.data[field];
	if (!date) return "";
	return formatDateToYYYYMMDD(
		date,
		field === "published" ? post.data._publishedDateOnly : post.data._updatedDateOnly,
	);
}
