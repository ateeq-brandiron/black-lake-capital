// Renders scripts/one-pager/one-pager.html to public/downloads/Black-Lake-Capital-One-Pager.pdf.
// Usage: node scripts/one-pager/build.mjs   (needs Playwright's Chromium and network access for Google Fonts)
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

// require() so a globally installed Playwright also resolves.
const { chromium } = createRequire(import.meta.url)("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const src = pathToFileURL(path.join(here, "one-pager.html")).href;
const out = path.join(here, "../../public/downloads/Black-Lake-Capital-One-Pager.pdf");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(src, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: out, format: "Letter", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`Wrote ${out}`);
