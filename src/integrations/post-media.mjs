import { createReadStream } from "node:fs";
import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

// 文章資料夾裡的影片（Astro 不會處理）在建置後複製到文章網址旁，
// 讓 Markdown 裡的 <video src="./xxx.mp4"> 用相對路徑就能播放。
// 圖片請用 ![](./xxx.jpg)，交給 Astro 最佳化，不在這裡處理。
const MEDIA_EXTS = new Set([".mp4", ".webm", ".mov", ".gif"]);
const MIME = { ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime", ".gif": "image/gif" };

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(full);
		else if (MEDIA_EXTS.has(extname(entry.name).toLowerCase())) yield full;
	}
}

export default function postMedia({ postsDir = "src/content/posts" } = {}) {
	let root;
	return {
		name: "post-media",
		hooks: {
			"astro:config:done": ({ config }) => {
				root = fileURLToPath(config.root);
			},
			"astro:build:done": async ({ dir, logger }) => {
				const src = join(root, postsDir);
				const out = join(fileURLToPath(dir), "posts");
				let count = 0;
				for await (const file of walk(src)) {
					const target = join(out, relative(src, file));
					await mkdir(dirname(target), { recursive: true });
					await cp(file, target);
					count++;
				}
				logger.info(`Copied ${count} post media file(s).`);
			},
			"astro:server:setup": ({ server }) => {
				const base = server.config.base.replace(/\/$/, "");
				server.middlewares.use(async (req, res, next) => {
					const path = decodeURIComponent((req.url ?? "").split("?")[0]);
					const prefix = `${base}/posts/`;
					if (!path.startsWith(prefix) || !MEDIA_EXTS.has(extname(path).toLowerCase())) return next();
					const file = join(root, postsDir, ...path.slice(prefix.length).split("/"));
					if (!file.startsWith(join(root, postsDir) + sep)) return next();
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
