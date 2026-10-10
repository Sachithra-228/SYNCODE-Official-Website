// Build-time pre-rendering.
//
// Runs after `vite build` (client, -> dist/) and `vite build --ssr` (-> dist-ssr/).
// Renders every route listed in src/lib/site.ts to dist/<route>/index.html so the
// page content is present in the raw HTML, then writes 404.html and sitemap.xml.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const serverEntry = pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href;

const { render, pages, getPageMeta, canonicalUrl, businessJsonLd, SITE_URL } = await import(serverEntry);

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
const ROOT_TAG = '<div id="root"></div>';
const HEAD_BLOCK = /<!--page-head-->[\s\S]*?<!--\/page-head-->/;

if (!template.includes(ROOT_TAG) || !HEAD_BLOCK.test(template)) {
  throw new Error("index.html is missing the #root element or the <!--page-head--> block");
}

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const headFor = (route) => {
  const meta = getPageMeta(route);
  const url = canonicalUrl(route);
  const title = esc(meta.title);
  const description = esc(meta.description);
  const jsonLd = JSON.stringify(businessJsonLd).replace(/</g, "\\u003c");

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex" : "index, follow"}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join("\n    ");
};

const textOf = (html) =>
  html
    .replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const renderPage = (route) => {
  const appHtml = render(route);
  const html = template
    .replace(HEAD_BLOCK, () => headFor(route))
    .replace(ROOT_TAG, () => `<div id="root" data-prerendered="${route}">${appHtml}</div>`);
  return { html, textLength: textOf(appHtml).length, h1Count: (appHtml.match(/<h1[\s>]/g) ?? []).length };
};

const routes = Object.keys(pages);
const problems = [];

for (const route of routes) {
  const { html, textLength, h1Count } = renderPage(route);
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route, "index.html");
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);

  console.log(`  ${route.padEnd(28)} ${String(textLength).padStart(6)} chars of text, ${h1Count} <h1>`);
  if (textLength < 200) problems.push(`${route}: only ${textLength} characters of text`);
  if (h1Count !== 1) problems.push(`${route}: expected exactly one <h1>, found ${h1Count}`);
}

// Vercel serves dist/404.html with a 404 status for any path that has no file.
await fs.writeFile(path.join(dist, "404.html"), renderPage("/404").html);

const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes
    .filter((route) => !pages[route].noindex)
    .map((route) => `  <url>\n    <loc>${canonicalUrl(route)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`),
  "</urlset>",
  "",
].join("\n");
await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap);

if (problems.length > 0) {
  console.error(`\nPre-render problems:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

console.log(`\nPre-rendered ${routes.length} pages, 404.html and sitemap.xml for ${SITE_URL}`);
