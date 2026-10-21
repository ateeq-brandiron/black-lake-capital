#!/usr/bin/env node
/**
 * Read-only extraction of the live WordPress site (blacklakecap.com).
 *
 * Only GET requests are made. Nothing on the live site is changed.
 *
 * Usage:
 *   node scripts/extract-wordpress.mjs [--base https://blacklakecap.com] [--no-screenshots] [--no-media]
 *
 * Writes:
 *   content/_source/inventory.md        every sitemap URL, with title + meta description
 *   content/_source/<slug>.md           clean text per page/post (images inline with alt)
 *   content/_source/pages.json          per-page metadata (title, description, OG, canonical, h1)
 *   content/_source/navigation.json     header menu tree + footer text/links
 *   content/_source/testimonials.json   every carousel testimonial (deduplicated)
 *   content/_source/news.json           every News post (REST first, DOM fallback)
 *   content/_source/tracking.json       GA4 / GTM / Search Console tags found in the HTML
 *   content/_source/wp-json/*.json      raw /wp-json/wp/v2/{pages,posts,media} responses
 *   content/_source/css/*               every stylesheet + inline <style> + computed styles
 *   public/images/*                     every image and the hero video (originals where available)
 *   public/images/manifest.json         file -> source URL, alt text, pages it appears on
 *   reference/<slug>.png                full-page screenshot (only if one is not already there)
 *
 * Playwright is not a project dependency. The script uses the globally installed copy
 * (`npm root -g`); install it globally if it is missing.
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = new URL(opt("--base", "https://blacklakecap.com")).origin;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "content/_source");
const IMG = path.join(ROOT, "public/images");
const REF = path.join(ROOT, "reference");
const SCREENSHOTS = !flag("--no-screenshots");
const MEDIA = !flag("--no-media");
const VIEWPORT = { width: 1440, height: 900 };
/** Pause between page loads; the live host answers 429 when crawled quickly. */
const DELAY_MS = Number(opt("--delay", "8000"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const globalRoot = execSync("npm root -g").toString().trim();
    const entry = path.join(globalRoot, "playwright/index.mjs");
    return import(pathToFileURL(entry).href);
  }
}

const log = (...m) => console.log("[extract]", ...m);
const writeJson = (file, data) => writeFile(file, JSON.stringify(data, null, 2) + "\n");

/** "/" -> "home", "/news/my-post/" -> "news--my-post" */
function slugFor(url) {
  const p = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  return p ? p.split("/").map(decodeURIComponent).join("--") : "home";
}

function isLocal(origin) {
  const host = new URL(origin).hostname;
  return host === "localhost" || host === "127.0.0.1";
}

// ---------------------------------------------------------------- sitemap

/** GET with retries on 429, honouring Retry-After. */
async function politeGet(request, url, options = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await request.get(url, { timeout: 30_000, ...options });
    if (res.status() !== 429 || attempt >= 4) return res;
    const wait = (Number(res.headers()["retry-after"]) || 30 * (attempt + 1)) * 1000;
    log(`429 on ${url}; waiting ${wait / 1000}s`);
    await sleep(wait);
  }
}

async function getText(request, url) {
  try {
    const res = await politeGet(request, url);
    if (!res.ok()) return { status: res.status(), text: null };
    return { status: res.status(), text: await res.text(), type: res.headers()["content-type"] ?? "" };
  } catch (err) {
    return { status: 0, text: null, error: String(err) };
  }
}

const locs = (xml) => [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?([^<\]]+?)(?:\]\]>)?\s*<\/loc>/g)].map((m) => m[1].trim());
const lastmods = (xml) => {
  const out = {};
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = locs(m[1])[0];
    const mod = m[1].match(/<lastmod>([^<]+)<\/lastmod>/);
    if (loc) out[loc] = mod?.[1] ?? "";
  }
  return out;
};

async function readSitemaps(request) {
  const candidates = ["/sitemap_index.xml", "/wp-sitemap.xml", "/sitemap.xml"];
  const robots = await getText(request, `${BASE}/robots.txt`);
  for (const m of robots.text?.matchAll(/^sitemap:\s*(\S+)/gim) ?? []) candidates.unshift(new URL(m[1]).pathname);

  const seen = new Set();
  const entries = []; // { url, sitemap, lastmod }
  const tried = [];
  // Use the first root sitemap that yields URLs (Yoast and WP core often both exist).
  for (const root of [...new Set(candidates)].map((p) => new URL(p, BASE).href)) {
    const queue = [root];
    while (queue.length) {
      const sm = queue.shift();
      if (seen.has(sm)) continue;
      seen.add(sm);
      const { status, text } = await getText(request, sm);
      tried.push({ sitemap: sm, status });
      if (!text || !text.includes("<loc>")) continue;
      if (/<sitemapindex/i.test(text)) {
        queue.push(...locs(text));
      } else {
        const mods = lastmods(text);
        for (const url of locs(text)) entries.push({ url, sitemap: sm, lastmod: mods[url] ?? "" });
      }
    }
    if (entries.length) break;
  }
  const byUrl = new Map();
  for (const e of entries) if (!byUrl.has(e.url)) byUrl.set(e.url, e);
  return { entries: [...byUrl.values()], tried };
}

/** page / post / taxonomy / author / other, from the sitemap file name. */
function kindOf(entry) {
  const name = path.basename(new URL(entry.sitemap).pathname);
  if (/post-sitemap|posts-post/.test(name)) return "post";
  if (/page-sitemap|posts-page/.test(name)) return "page";
  if (/category|tag|taxonom/.test(name)) return "taxonomy";
  if (/testimonial/.test(name)) return "testimonial";
  if (/author|users/.test(name)) return "author";
  if (/attachment|media|image/.test(name)) return "attachment";
  return "other";
}

// ---------------------------------------------------------------- wp-json

async function fetchWpJson(request) {
  const out = {};
  await mkdir(path.join(SRC, "wp-json"), { recursive: true });
  for (const type of ["pages", "posts", "categories", "project"]) {
    const all = [];
    let status = 0;
    for (let page = 1; page < 50; page++) {
      try {
        const res = await politeGet(request, `${BASE}/wp-json/wp/v2/${type}?per_page=100&page=${page}`);
        status = res.status();
        if (!res.ok()) break;
        const batch = await res.json();
        if (!Array.isArray(batch) || batch.length === 0) break;
        all.push(...batch);
        const totalPages = Number(res.headers()["x-wp-totalpages"] ?? 1);
        if (page >= totalPages) break;
      } catch (err) {
        status = String(err).slice(0, 120);
        break;
      }
    }
    out[type] = { status, count: all.length };
    if (all.length) await writeJson(path.join(SRC, "wp-json", `${type}.json`), all);
  }
  await writeJson(path.join(SRC, "wp-json", "_status.json"), out);
  return out;
}

// ---------------------------------------------------------------- in-page extraction

/** Runs in the browser. Returns metadata, markdown body, nav, footer, images, testimonials. */
function extractInPage() {
  const abs = (u) => {
    try {
      return new URL(u, location.href).href;
    } catch {
      return null;
    }
  };
  const clean = (s) => (s ?? "").replace(/\s+/g, " ").trim();
  const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? "";

  // --- images (img, srcset, lazy attrs, picture, css backgrounds, video)
  const images = [];
  const pushImg = (src, alt, kind, el) => {
    const url = src && abs(src);
    if (!url || url.startsWith("data:")) return;
    images.push({ src: url, alt: alt ?? "", kind, context: el ? el.className?.toString().slice(0, 80) : "" });
  };
  const largestFromSrcset = (srcset) => {
    if (!srcset) return null;
    const parts = srcset.split(",").map((p) => p.trim().split(/\s+/));
    parts.sort((a, b) => parseFloat(b[1] ?? "0") - parseFloat(a[1] ?? "0"));
    return parts[0]?.[0] ?? null;
  };
  for (const img of document.querySelectorAll("img")) {
    const src =
      largestFromSrcset(img.getAttribute("srcset") || img.getAttribute("data-srcset")) ||
      img.getAttribute("data-src") ||
      img.getAttribute("data-lazy-src") ||
      img.currentSrc ||
      img.getAttribute("src");
    pushImg(src, img.getAttribute("alt"), "img", img);
  }
  for (const s of document.querySelectorAll("picture source")) pushImg(largestFromSrcset(s.getAttribute("srcset")), "", "picture", s);
  for (const el of document.querySelectorAll("*")) {
    const bg = getComputedStyle(el).backgroundImage;
    for (const m of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) pushImg(m[1], el.getAttribute("aria-label") ?? "", "background", el);
  }
  for (const v of document.querySelectorAll("video")) {
    pushImg(v.getAttribute("poster"), "", "video-poster", v);
    pushImg(v.currentSrc || v.getAttribute("src"), "", "video", v);
    for (const s of v.querySelectorAll("source")) pushImg(s.getAttribute("src"), "", "video", v);
  }
  const iframes = [...document.querySelectorAll("iframe")].map((f) => abs(f.getAttribute("src") || f.getAttribute("data-src"))).filter(Boolean);
  for (const sel of ['meta[property="og:image"]', 'link[rel~="icon"]', 'link[rel="apple-touch-icon"]']) {
    const el = document.querySelector(sel);
    pushImg(el?.getAttribute("content") || el?.getAttribute("href"), "", "meta", null);
  }

  // --- header navigation tree
  const headerEl = document.querySelector("header, #masthead, .site-header, [data-elementor-type='header']");
  const menuRoot = headerEl?.querySelector("nav ul, ul.menu, ul[id*='menu']") ?? document.querySelector("nav ul");
  const walkMenu = (ul) =>
    [...(ul?.children ?? [])]
      .filter((li) => li.tagName === "LI")
      .map((li) => {
        const a = li.querySelector(":scope > a, :scope > div > a");
        const sub = li.querySelector(":scope > ul, :scope > div > ul");
        return { label: clean(a?.textContent), href: a ? abs(a.getAttribute("href")) : null, children: sub ? walkMenu(sub) : [] };
      });
  const footerEl = document.querySelector("footer, #colophon, .site-footer, [data-elementor-type='footer']");
  const linksIn = (el) => [...(el?.querySelectorAll("a") ?? [])].map((a) => ({ label: clean(a.textContent) || a.getAttribute("aria-label") || "", href: abs(a.getAttribute("href")) }));

  // --- testimonials: carousel slides / blockquotes, skipping slider clones
  const testimonialEls = [
    ...document.querySelectorAll(
      "[class*='testimonial' i]:not([class*='testimonials' i]), .elementor-testimonial, .swiper-slide:not(.swiper-slide-duplicate), .slick-slide:not(.slick-cloned), blockquote",
    ),
  ];
  const testimonials = [];
  for (const el of testimonialEls) {
    if (el.closest(".slick-cloned, .swiper-slide-duplicate")) continue;
    const text = clean(el.innerText);
    if (text.length < 40) continue;
    const quoteEl = el.querySelector("blockquote, [class*='content' i], [class*='text' i], p") ?? el;
    const citeEl = el.querySelector("cite, [class*='name' i], [class*='author' i], footer, strong");
    const titleEl = el.querySelector("[class*='title' i]:not([class*='name' i]), [class*='company' i], [class*='job' i], [class*='position' i]");
    testimonials.push({
      quote: clean(quoteEl.innerText),
      name: clean(citeEl?.innerText),
      title: clean(titleEl?.innerText),
      raw: text,
      image: el.querySelector("img") ? abs(el.querySelector("img").getAttribute("src")) : null,
      selector: `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join(".")}`,
    });
  }

  // --- main content to markdown
  const mainEl =
    document.querySelector("main, #main, #content .entry-content, .site-content, [data-elementor-type='wp-page'], [data-elementor-type='single-post'], article") ??
    document.body;
  const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "TEMPLATE", "FORM", "BUTTON", "SELECT"]);
  const md = [];
  const inline = (node) => {
    let s = "";
    for (const c of node.childNodes) {
      if (c.nodeType === 3) s += c.textContent;
      else if (c.nodeType === 1 && !skip.has(c.tagName)) {
        if (getComputedStyle(c).display === "none") continue;
        if (c.tagName === "A") {
          const t = clean(inline(c));
          s += t ? `[${t}](${abs(c.getAttribute("href")) ?? ""})` : "";
        } else if (c.tagName === "STRONG" || c.tagName === "B") s += `**${clean(inline(c))}** `;
        else if (c.tagName === "EM" || c.tagName === "I") s += `*${clean(inline(c))}* `;
        else if (c.tagName === "BR") s += "\n";
        else if (c.tagName === "IMG") s += `![${c.getAttribute("alt") ?? ""}](${abs(c.currentSrc || c.getAttribute("src"))})`;
        else s += inline(c);
      }
    }
    return s;
  };
  const block = (node) => {
    if (node.nodeType !== 1 || skip.has(node.tagName)) return;
    if (node.closest(".slick-cloned, .swiper-slide-duplicate")) return;
    if (node !== mainEl && (node.matches("header, footer, #masthead, #colophon") || node.closest("[data-elementor-type='header'], [data-elementor-type='footer']"))) return;
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return;
    const tag = node.tagName;
    const text = () => clean(inline(node));
    if (/^H[1-6]$/.test(tag)) return void (text() && md.push(`${"#".repeat(+tag[1])} ${text()}`));
    if (tag === "P") return void (text() && md.push(text()));
    if (tag === "BLOCKQUOTE") return void (text() && md.push(`> ${text()}`));
    if (tag === "UL" || tag === "OL") {
      [...node.children].forEach((li, i) => {
        const t = clean(inline(li));
        if (t) md.push(`${tag === "OL" ? `${i + 1}.` : "-"} ${t}`);
      });
      return;
    }
    if (tag === "IMG") return void md.push(`![${node.getAttribute("alt") ?? ""}](${abs(node.currentSrc || node.getAttribute("src"))})`);
    if (tag === "VIDEO") return void md.push(`[video](${abs(node.currentSrc || node.querySelector("source")?.getAttribute("src") || "")})`);
    if (tag === "A" && node.matches("[class*='button' i], [class*='btn' i]")) return void (text() && md.push(`[BUTTON: ${text()}](${abs(node.getAttribute("href"))})`));
    // Leaf containers with only inline content (common in page builders).
    const hasBlockChild = [...node.children].some((c) => !["A", "SPAN", "STRONG", "EM", "B", "I", "BR", "SMALL", "SUP", "SUB"].includes(c.tagName));
    if (!hasBlockChild) {
      const t = text();
      if (t) md.push(t);
      return;
    }
    for (const c of node.children) block(c);
  };
  block(mainEl);

  const html = document.documentElement.outerHTML;
  return {
    title: document.title,
    description: meta('meta[name="description"]'),
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    robots: meta('meta[name="robots"]'),
    og: {
      title: meta('meta[property="og:title"]'),
      description: meta('meta[property="og:description"]'),
      image: meta('meta[property="og:image"]'),
      type: meta('meta[property="og:type"]'),
    },
    published: meta('meta[property="article:published_time"]') || document.querySelector("time[datetime]")?.getAttribute("datetime") || "",
    h1: [...document.querySelectorAll("h1")].map((h) => clean(h.textContent)),
    bodyClass: document.body.className,
    markdown: md.join("\n\n"),
    images,
    iframes,
    nav: walkMenu(menuRoot),
    footer: { text: footerEl ? footerEl.innerText.trim() : "", links: linksIn(footerEl) },
    internalLinks: [...new Set([...document.querySelectorAll("a[href]")].map((a) => abs(a.getAttribute("href"))).filter((u) => u && new URL(u).origin === location.origin).map((u) => u.split("#")[0]))],
    testimonials,
    tracking: {
      ga4: [...new Set(html.match(/G-[A-Z0-9]{6,12}/g) ?? [])],
      ua: [...new Set(html.match(/UA-\d{4,10}-\d{1,4}/g) ?? [])],
      gtm: [...new Set(html.match(/GTM-[A-Z0-9]{4,10}/g) ?? [])],
      googleSiteVerification: [...document.querySelectorAll('meta[name="google-site-verification"]')].map((m) => m.content),
    },
    stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href),
    inlineStyles: [...document.querySelectorAll("style")].map((s) => s.textContent),
    fontLinks: [...document.querySelectorAll('link[href*="fonts.googleapis"], link[href*="typekit"], link[rel="preload"][as="font"]')].map((l) => l.href),
  };
}

/** Computed styles of representative elements, for design tokens. Runs in the browser. */
function computedStylesInPage() {
  const props = ["color", "backgroundColor", "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "padding", "margin", "borderRadius", "border", "maxWidth", "boxShadow"];
  const sels = [
    "body", "h1", "h2", "h3", "h4", "h5", "p", "a", "header", "nav a", "footer", "footer a",
    "a[class*='button' i], .elementor-button, .wp-block-button__link, .btn",
    "section", ".elementor-container, .container, .wp-block-group__inner-container",
    "[class*='counter' i], [class*='number' i]", "blockquote, [class*='testimonial' i]",
  ];
  const out = {};
  for (const sel of sels) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const cs = getComputedStyle(el);
    out[sel] = Object.fromEntries(props.map((p) => [p, cs[p]]));
  }
  // Colour usage frequency across the page.
  const freq = {};
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    for (const p of ["color", "backgroundColor", "borderTopColor"]) {
      const v = cs[p];
      if (v && v !== "rgba(0, 0, 0, 0)") freq[`${p}:${v}`] = (freq[`${p}:${v}`] ?? 0) + 1;
    }
  }
  out._colorFrequency = Object.fromEntries(Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 60));
  out._cssVariables = Object.fromEntries(
    [...document.styleSheets].flatMap((s) => {
      try {
        return [...s.cssRules];
      } catch {
        return [];
      }
    })
      .filter((r) => r.selectorText === ":root" || r.selectorText?.includes("elementor-kit"))
      .flatMap((r) => [...r.style].filter((p) => p.startsWith("--")).map((p) => [p, r.style.getPropertyValue(p).trim()])),
  );
  return out;
}

// ---------------------------------------------------------------- media download

const extFromType = (t) =>
  ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/svg+xml": ".svg", "image/x-icon": ".ico", "image/avif": ".avif", "video/mp4": ".mp4", "video/webm": ".webm" })[
    (t ?? "").split(";")[0]
  ] ?? "";

/** WordPress resizes uploads as name-300x200.jpg; try the original first. */
const originalOf = (url) => url.replace(/-(\d{2,5})x(\d{2,5})(\.[a-z0-9]+)(\?.*)?$/i, "$3");

async function downloadMedia(request, images) {
  await mkdir(IMG, { recursive: true });
  const bySrc = new Map();
  for (const im of images) {
    const cur = bySrc.get(im.src);
    if (!cur) bySrc.set(im.src, { ...im, pages: new Set([im.page]) });
    else {
      cur.pages.add(im.page);
      if (!cur.alt && im.alt) cur.alt = im.alt;
    }
  }
  const manifest = [];
  const usedNames = new Set();
  const byOriginal = new Map();
  for (const im of bySrc.values()) {
    const tryUrls = [...new Set([originalOf(im.src), im.src])];
    let saved = null;
    for (const url of tryUrls) {
      if (byOriginal.has(url)) {
        saved = byOriginal.get(url);
        break;
      }
      try {
        const res = await politeGet(request, url, { timeout: 120_000 });
        await sleep(500);
        if (!res.ok()) continue;
        const body = await res.body();
        let name = decodeURIComponent(path.basename(new URL(url).pathname)) || "file";
        if (!path.extname(name)) name += extFromType(res.headers()["content-type"]);
        name = name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
        if (usedNames.has(name)) name = `${path.parse(name).name}-${createHash("sha1").update(url).digest("hex").slice(0, 6)}${path.extname(name)}`;
        usedNames.add(name);
        await writeFile(path.join(IMG, name), body);
        saved = { file: `/images/${name}`, from: url, bytes: body.length, type: res.headers()["content-type"] ?? "" };
        byOriginal.set(url, saved);
        break;
      } catch (err) {
        log("download failed", url, String(err).slice(0, 100));
      }
    }
    manifest.push({ ...(saved ?? { file: null, from: im.src, error: "download failed" }), src: im.src, alt: im.alt, kind: im.kind, context: im.context, pages: [...im.pages] });
  }
  await writeJson(path.join(IMG, "manifest.json"), manifest);
  return manifest;
}

// ---------------------------------------------------------------- main

async function main() {
  const { chromium, request: pwRequest } = await loadPlaywright();
  const proxyServer = process.env.HTTPS_PROXY || process.env.https_proxy;
  const proxy = proxyServer && !isLocal(BASE) ? { server: proxyServer } : undefined;
  await mkdir(path.join(SRC, "css"), { recursive: true });
  await mkdir(REF, { recursive: true });

  const request = await pwRequest.newContext({ proxy, userAgent: "BlackLakeRebuild-Extractor/1.0 (read-only)" });

  log("reading sitemaps from", BASE);
  const { entries, tried } = await readSitemaps(request);
  if (!entries.length) {
    log("no sitemap URLs found; falling back to the home page only");
    entries.push({ url: `${BASE}/`, sitemap: "(none)", lastmod: "" });
  }
  for (const e of entries) e.kind = kindOf(e);
  log(`${entries.length} sitemap URLs`, JSON.stringify(tried));

  log("querying /wp-json/wp/v2");
  const wpStatus = await fetchWpJson(request);

  const browser = await chromium.launch({ proxy });
  const context = await browser.newContext({ viewport: VIEWPORT, userAgent: "BlackLakeRebuild-Extractor/1.0 (read-only)" });
  // Never submit anything: block every non-GET request from the page.
  // Also skip trackers: they are irrelevant to content and slow every page down.
  const TRACKERS = /googletagmanager|google-analytics|doubleclick|licdn|linkedin\.com\/(px|li)|facebook\.(net|com)\/tr|hotjar|clarity\.ms/;
  await context.route("**/*", (route) => {
    const req = route.request();
    if (req.method() !== "GET" || TRACKERS.test(req.url())) return route.abort();
    return route.continue();
  });

  const pages = [];
  const allImages = [];
  const allTestimonials = [];
  const stylesheets = new Set();
  const inlineStyles = new Set();
  let nav = null;
  let footer = null;
  let computed = null;
  const linked = new Set();
  const tracking = { ga4: new Set(), ua: new Set(), gtm: new Set(), googleSiteVerification: new Set() };

  for (const entry of entries) {
    // Posts come from /wp-json (full content); archives add nothing.
    if (["attachment", "author", "taxonomy", "post"].includes(entry.kind)) continue;
    const slug = slugFor(entry.url);
    log("page", entry.url);
    const page = await context.newPage();
    try {
      // "load", not "networkidle": a looping hero video never goes idle.
      let res = await page.goto(entry.url, { waitUntil: "load", timeout: 60_000 });
      for (let attempt = 1; res?.status() === 429 && attempt <= 4; attempt++) {
        const wait = (Number(res.headers()["retry-after"]) || 45 * attempt) * 1000;
        log(`429 on ${entry.url}; waiting ${wait / 1000}s`);
        await sleep(wait);
        res = await page.goto(entry.url, { waitUntil: "load", timeout: 60_000 });
      }
      // Scroll to trigger lazy-loaded images and counters, then return to top.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1500);
      const data = await page.evaluate(extractInPage);
      if (!computed && slug === "home") computed = await page.evaluate(computedStylesInPage);

      data.images.forEach((im) => allImages.push({ ...im, page: entry.url }));
      data.testimonials.forEach((t) => allTestimonials.push({ ...t, page: entry.url }));
      data.stylesheets.forEach((s) => stylesheets.add(s));
      data.inlineStyles.forEach((s) => inlineStyles.add(s));
      data.internalLinks.forEach((l) => linked.add(l));
      for (const k of Object.keys(tracking)) data.tracking[k].forEach((v) => tracking[k].add(v));
      if (!nav && data.nav.length) nav = data.nav;
      if (!footer && data.footer.text) footer = data.footer;

      const header = [
        `# ${data.title}`,
        "",
        `- URL: ${entry.url}`,
        `- Kind: ${entry.kind}`,
        `- HTTP status: ${res?.status() ?? "?"}`,
        `- Meta description: ${data.description || "(none)"}`,
        `- Canonical: ${data.canonical || "(none)"}`,
        data.published ? `- Published: ${data.published}` : null,
        data.iframes.length ? `- Embeds: ${data.iframes.join(", ")}` : null,
        "",
        "---",
        "",
      ].filter((l) => l !== null);
      await writeFile(path.join(SRC, `${slug}.md`), header.join("\n") + data.markdown + "\n");

      if (SCREENSHOTS) {
        const shot = path.join(REF, `${slug}.png`);
        if (!existsSync(shot)) await page.screenshot({ path: shot, fullPage: true });
      }

      pages.push({
        url: entry.url,
        slug,
        kind: entry.kind,
        lastmod: entry.lastmod,
        status: res?.status() ?? 0,
        title: data.title,
        description: data.description,
        canonical: data.canonical,
        robots: data.robots,
        og: data.og,
        h1: data.h1,
        published: data.published,
        bodyClass: data.bodyClass,
      });
    } catch (err) {
      log("FAILED", entry.url, String(err).slice(0, 200));
      pages.push({ url: entry.url, slug, kind: entry.kind, status: 0, error: String(err).slice(0, 200) });
    } finally {
      await page.close();
      await sleep(DELAY_MS);
    }
  }

  // Mobile screenshot of Home, for responsive reference.
  if (SCREENSHOTS && !existsSync(path.join(REF, "home-mobile.png"))) {
    const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
    const p = await m.newPage();
    await p.goto(`${BASE}/`, { waitUntil: "load", timeout: 60_000 }).catch(() => {});
    await p.waitForTimeout(2000);
    await p.screenshot({ path: path.join(REF, "home-mobile.png"), fullPage: true }).catch(() => {});
    await m.close();
  }
  await browser.close();

  // ---- CSS
  let i = 0;
  const cssIndex = [];
  for (const href of stylesheets) {
    const { text, status } = await getText(request, href);
    const file = `${String(++i).padStart(2, "0")}-${path.basename(new URL(href).pathname).replace(/[^a-z0-9._-]+/gi, "-") || "style.css"}`;
    if (text) await writeFile(path.join(SRC, "css", file), text);
    cssIndex.push({ href, file: text ? file : null, status });
  }
  await writeFile(path.join(SRC, "css", "inline-styles.css"), [...inlineStyles].join("\n\n/* ---- */\n\n"));
  await writeJson(path.join(SRC, "css", "index.json"), cssIndex);
  if (computed) await writeJson(path.join(SRC, "css", "computed-home.json"), computed);

  // ---- testimonials (deduplicated on quote text)
  const seenQuotes = new Map();
  for (const t of allTestimonials) {
    const key = t.quote.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 120);
    if (!key) continue;
    const cur = seenQuotes.get(key);
    if (!cur) seenQuotes.set(key, { ...t, pages: [t.page] });
    else if (!cur.pages.includes(t.page)) cur.pages.push(t.page);
  }
  // Drop entries fully contained in a longer one (wrapper + inner element both matched).
  const tList = [...seenQuotes.values()].filter((t, _, arr) => !arr.some((o) => o !== t && o.raw.length > t.raw.length && o.raw.includes(t.quote)));
  await writeJson(path.join(SRC, "testimonials.json"), tList.map((t) => ({ quote: t.quote, name: t.name, title: t.title, raw: t.raw, image: t.image, selector: t.selector, pages: t.pages })));

  // ---- news posts
  let news = [];
  try {
    const { readFile } = await import("node:fs/promises");
    const posts = JSON.parse(await readFile(path.join(SRC, "wp-json", "posts.json"), "utf8"));
    news = posts.map((p) => ({
      id: p.id,
      url: p.link,
      slug: p.slug,
      title: p.title?.rendered ?? "",
      date: p.date,
      modified: p.modified,
      excerpt: (p.excerpt?.rendered ?? "").replace(/<[^>]+>/g, "").trim(),
      featuredMediaId: p.featured_media,
      categories: p.categories,
      source: "wp-json",
    }));
  } catch {
    news = pages.filter((p) => p.kind === "post").map((p) => ({ url: p.url, slug: p.slug, title: p.title, date: p.published, source: "dom" }));
  }
  await writeJson(path.join(SRC, "news.json"), news);

  // ---- media
  const manifest = MEDIA ? await downloadMedia(request, allImages) : [];
  await request.dispose();

  // ---- shared json
  await writeJson(path.join(SRC, "pages.json"), pages);
  await writeJson(path.join(SRC, "navigation.json"), { header: nav ?? [], footer: footer ?? {} });
  await writeJson(path.join(SRC, "tracking.json"), Object.fromEntries(Object.entries(tracking).map(([k, v]) => [k, [...v]])));

  // ---- inventory.md
  const sitemapUrls = new Set(entries.map((e) => e.url.replace(/\/$/, "")));
  const notInSitemap = [...linked].filter((l) => !sitemapUrls.has(l.replace(/\/$/, "")) && !/\.(jpe?g|png|pdf|webp|gif|svg|mp4)$/i.test(l) && !/\/wp-(content|admin|json|login)/.test(l));
  const row = (p) => `| ${p.kind} | [${new URL(p.url).pathname}](${p.url}) | \`${p.slug}\` | ${p.status} | ${(p.title ?? "").replace(/\|/g, "\\|")} | ${(p.description || "(none)").replace(/\|/g, "\\|")} |`;
  const table = (list) => ["| Kind | Path | Slug | Status | Title | Meta description |", "| --- | --- | --- | --- | --- | --- |", ...list.map(row)].join("\n");
  const inv = [
    "# blacklakecap.com inventory",
    "",
    `Extracted ${new Date().toISOString()} from ${BASE} by \`scripts/extract-wordpress.mjs\` (read-only).`,
    "",
    "## Sitemaps read",
    "",
    ...tried.map((t) => `- ${t.sitemap} → ${t.status}`),
    "",
    "## Pages",
    "",
    table(pages.filter((p) => p.kind !== "post")),
    "",
    "## Posts (News)",
    "",
    news.length ? ["| Date | Title | URL |", "| --- | --- | --- |", ...news.map((n) => `| ${(n.date ?? "").slice(0, 10)} | ${(n.title ?? "").replace(/\|/g, "\\|")} | ${n.url} |`)].join("\n") : "(none found)",
    "",
    "## Skipped sitemap entries",
    "",
    ...entries.filter((e) => ["attachment", "author", "taxonomy"].includes(e.kind)).map((e) => `- ${e.kind}: ${e.url}`),
    "",
    "## Linked internally but not in the sitemap",
    "",
    ...(notInSitemap.length ? notInSitemap.map((l) => `- ${l}`) : ["(none)"]),
    "",
    "## Testimonials in the carousel",
    "",
    ...(tList.length ? tList.map((t, n) => `${n + 1}. "${t.quote}" (${t.name || "name not parsed"}${t.title ? `, ${t.title}` : ""})`) : ["(none found)"]),
    "",
    "## WP REST API",
    "",
    ...Object.entries(wpStatus).map(([k, v]) => `- /wp-json/wp/v2/${k}: status ${v.status}, ${v.count} items`),
    "",
    "## Media",
    "",
    `- ${manifest.filter((m) => m.file).length} files downloaded, ${manifest.filter((m) => !m.file).length} failed (see public/images/manifest.json)`,
    `- Videos: ${manifest.filter((m) => m.kind === "video").map((m) => m.file ?? m.src).join(", ") || "(none)"}`,
    "",
    "## Tracking tags",
    "",
    ...Object.entries(tracking).map(([k, v]) => `- ${k}: ${[...v].join(", ") || "(none)"}`),
    "",
  ];
  await writeFile(path.join(SRC, "inventory.md"), inv.join("\n"));
  log("done:", pages.length, "pages,", news.length, "posts,", tList.length, "testimonials,", manifest.length, "media");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
