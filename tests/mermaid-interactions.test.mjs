import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

import { rehypeMermaid } from "../src/plugins/rehype-mermaid.mjs";

const layoutSource = await readFile(
	new URL("../src/layouts/Layout.astro", import.meta.url),
	"utf8",
);
const managerSource = await readFile(
	new URL(
		"../src/components/features/markdown/MermaidManager.astro",
		import.meta.url,
	),
	"utf8",
);
const rehypeSource = await readFile(
	new URL("../src/plugins/rehype-mermaid.mjs", import.meta.url),
	"utf8",
);
const interactionSource = await readFile(
	new URL("../src/plugins/mermaid-render-script.js", import.meta.url),
	"utf8",
);
const markdownStyles = await readFile(
	new URL("../src/styles/markdown-extend.styl", import.meta.url),
	"utf8",
);
const expressiveCodeStyles = await readFile(
	new URL("../src/styles/expressive-code.css", import.meta.url),
	"utf8",
);

describe("Mermaid interaction regressions", () => {
	it("loads one lazy Mermaid manager instead of embedding the runtime per diagram", () => {
		assert.match(layoutSource, /import MermaidManager/);
		assert.match(layoutSource, /<MermaidManager\s*\/>/);
		assert.match(
			managerSource,
			/import "@\/plugins\/mermaid-render-script\.js"/,
		);
		assert.match(managerSource, /<script>/);
		assert.doesNotMatch(managerSource, /is:inline|\?raw/);
		assert.doesNotMatch(
			rehypeSource,
			/mermaidRenderScript|h\(\s*["']script["']/,
		);
		assert.match(interactionSource, /if \(window\.mermaid\?\.render\) return/);
	});

	it("emits only diagram markup from the Markdown transformer", () => {
		const tree = {
			type: "root",
			children: [
				{
					type: "element",
					tagName: "div",
					properties: {
						className: ["mermaid-container"],
						"data-mermaid-code": "graph TD; A-->B",
					},
					children: [],
				},
			],
		};

		rehypeMermaid()(tree);
		assert.equal(
			tree.children[0].properties.class,
			"mermaid-diagram-container",
		);
		assert.equal(tree.children[0].children.length, 1);
		assert.equal(tree.children[0].children[0].tagName, "div");
		assert.equal(tree.children[0].children[0].children[0].tagName, "div");
	});

	it("keeps fullscreen in the shared toolbar and the draggable viewport separate", () => {
		assert.doesNotMatch(
			interactionSource,
			/injectFullscreenStyles|mermaid-fullscreen-btn/,
		);
		assert.match(interactionSource, /name: "fullscreen"/);
		assert.match(
			interactionSource,
			/viewport\.addEventListener\(\s*"pointerdown"/s,
		);
		assert.match(
			interactionSource,
			/attachDiagramInteraction\(stage, clonedSvg\)/,
		);
		assert.match(
			markdownStyles,
			/\.mermaid-viewport\s+[\s\S]*?touch-action: none/,
		);
		assert.match(
			markdownStyles,
			/\.mermaid-fullscreen-stage[\s\S]*?\.mermaid-zoom-controls\s+top: \.75rem\s+right: auto\s+bottom: auto\s+left: \.75rem/,
		);
		assert.doesNotMatch(expressiveCodeStyles, /mermaid-fullscreen-btn/);
	});

	it("cleans up fullscreen listeners and restores keyboard focus", () => {
		assert.match(interactionSource, /session\.eventController\.abort\(\)/);
		assert.match(interactionSource, /session\.diagramController\.destroy\(\)/);
		assert.match(
			interactionSource,
			/session\.previousFocus\.focus\(\{ preventScroll: true \}\)/,
		);
		assert.match(interactionSource, /aria-modal/);
		assert.match(interactionSource, /event\.key === "Escape"/);
	});
});
