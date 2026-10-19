import { createReadStream } from "node:fs";
import { cp, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// 文章（posts）與專案介紹（projects）資料夾裡的影片（Astro 不會處理）在建置後複製到文章網址旁，
// 讓 Markdown 裡的 <video src="./xxx.mp4"> 用相對路徑就能播放。
// 圖片請用 ![](./xxx.jpg)，交給 Astro 最佳化，不在這裡處理。
// 英文版（base 不是 /）不再複製一份，而是把頁面裡的 ./xxx.mp4 改指向繁中版那一份。
const MEDIA_EXTS = new Set([".mp4", ".webm", ".mov", ".gif"]);
const MIME = { ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime", ".gif": "image/gif" };

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(full);
		else if (MEDIA_EXTS.has(extname(entry.name).toLowerCase())) yield full;
	}
}

// 內容資料夾 → 網址前綴
const SOURCES = [
	{ dir: "src/content/posts", url: "posts" },
	{ dir: "src/content/projects", url: "projects" },
];

export default function postMedia() {
	let root;
	let base;
	return {
		name: "post-media",
		hooks: {
			"astro:config:done": ({ config }) => {
				root = fileURLToPath(config.root);
				base = config.base;
			},
			"astro:build:done": async ({ dir, logger }) => {
				let count = 0;
				const shared = base !== "/";
				for (const source of SOURCES) {
					const src = join(root, source.dir);
					const out = join(fileURLToPath(dir), source.url);
					for await (const file of walk(src)) {
						const rel = relative(src, file);
						if (shared) {
							const html = join(out, dirname(rel), "index.html");
							const content = await readFile(html, "utf8").catch(() => null);
							if (content === null) continue;
							const name = rel.split(sep).pop();
							const rootUrl = `/${source.url}/${rel.split(sep).join("/")}`;
							await writeFile(html, content.replaceAll(`"./${name}"`, `"${rootUrl}"`));
						} else {
							const target = join(out, rel);
							await mkdir(dirname(target), { recursive: true });
							await cp(file, target);
						}
						count++;
					}
				}
				logger.info(`${shared ? "Linked" : "Copied"} ${count} post media file(s).`);
			},
			"astro:server:setup": ({ server }) => {
				const base = server.config.base.replace(/\/$/, "");
				server.middlewares.use(async (req, res, next) => {
					const path = decodeURIComponent((req.url ?? "").split("?")[0]);
					if (!MEDIA_EXTS.has(extname(path).toLowerCase())) return next();
					const source = SOURCES.find((s) => path.startsWith(`${base}/${s.url}/`));
					if (!source) return next();
					const rootDir = join(root, source.dir);
					const file = join(rootDir, ...path.slice(`${base}/${source.url}/`.length).split("/"));
					if (!file.startsWith(rootDir + sep)) return next();
					try {
						const info = await stat(file);
						res.setHeader("Content-Type", MIME[extname(file).toLowerCase()]);
						res.setHeader("Content-Length", info.size);
						createReadStream(file).pipe(res);
					} catch {
						next();
					}
				});
			},
		},
	};
}
