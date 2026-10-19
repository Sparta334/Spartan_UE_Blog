import type { APIRoute } from "astro";

const robotsTxt = `
User-agent: *
Disallow: /
Allow: /$
Allow: /posts/
Allow: /en/$
Allow: /en/posts/

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
Sitemap: ${new URL("en/sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
