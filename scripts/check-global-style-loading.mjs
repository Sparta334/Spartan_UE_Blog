import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const distDirectory = path.join(projectRoot, "dist");
const astroConfig = await readFile(
	path.join(projectRoot, "astro.config.mjs"),
	"utf8",
);
// 部署在子路徑（如 GitHub Pages 專案頁）時，連結會帶 base 前綴
const basePath = astroConfig.match(/^\s*base:\s*"([^"]*)"/m)?.[1] ?? "/";

function getAttribute(tag, name) {
	const match = tag.match(
		new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
	);
	return match?.[1] ?? match?.[2] ?? match?.[3];
}

async function loadPageStyles(htmlPath) {
	const html = await readFile(path.join(distDirectory, htmlPath), "utf8");
	const stylesheetUrls = [...html.matchAll(/<link\b[^>]*>/gi)]
		.map(([tag]) => ({
			href: getAttribute(tag, "href"),
			rel: getAttribute(tag, "rel"),
		}))
		.filter(
			({ href, rel }) =>
				href && rel?.split(/\s+/).some((value) => value === "stylesheet"),
		)
		.map(({ href }) => href);

	const inlineStyles = [
		...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi),
	]
		.map((match) => match[1])
		.join("\n");

	const linkedStyles = await Promise.all(
		stylesheetUrls.map(async (stylesheetUrl) => {
			let pathname = decodeURIComponent(stylesheetUrl.split(/[?#]/, 1)[0]);
			if (basePath !== "/" && pathname.startsWith(basePath)) {
				pathname = `/${pathname.slice(basePath.length)}`;
			}
			if (
				/^(?:[a-z]+:)?\/\//i.test(pathname) ||
				pathname.startsWith("data:")
			) {
				return "";
			}

			const assetPath = path.resolve(
				distDirectory,
				pathname.startsWith("/") ? pathname.slice(1) : pathname,
			);
			const relativePath = path.relative(distDirectory, assetPath);
			if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
				throw new Error(
					`Stylesheet escapes dist directory: ${stylesheetUrl}`,
				);
			}

			return readFile(assetPath, "utf8");
		}),
	);

	return {
		html,
		loadedCss: `${inlineStyles}\n${linkedStyles.join("\n")}`,
		stylesheetUrls,
	};
}

const pages = [
	{
		name: "Homepage",
		htmlPath: "index.html",
		requiredMarkup: [["site-header", "site header"]],
		requiredRules: [
			["--site-bg:", "site background variable"],
			["--panel:", "panel background variable"],
		],
	},
	{
		name: "Post page",
		htmlPath: "posts/ue-cpp/uproperty-cheatsheet/index.html",
		requiredMarkup: [
			["doc-nav", "topic navigation"],
			["expressive-code", "rendered code block"],
		],
		requiredRules: [
			[".custom-md", "Markdown content styles"],
			[".copy-btn", "code block copy button styles"],
		],
	},
];

for (const page of pages) {
	const { html, loadedCss, stylesheetUrls } = await loadPageStyles(page.htmlPath);
	const missingMarkup = page.requiredMarkup
		.filter(([token]) => !html.includes(token))
		.map(([, description]) => description);
	const missingRules = page.requiredRules
		.filter(([token]) => !loadedCss.includes(token))
		.map(([, description]) => description);

	if (missingMarkup.length > 0 || missingRules.length > 0) {
		const loadedStylesheets = stylesheetUrls.join(", ") || "none";
		const missing = [
			...missingMarkup.map((description) => `${description} markup`),
			...missingRules,
		];
		throw new Error(
			`${page.name} is missing: ${missing.join(", ")}. ` +
				`Loaded stylesheets: ${loadedStylesheets}`,
		);
	}

	console.log(
		`Verified ${page.name.toLowerCase()} styles across ` +
			`${stylesheetUrls.length} linked stylesheet(s).`,
	);
}
