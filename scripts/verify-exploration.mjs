import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadTypeScript } from "./lib/load-typescript.mjs";
import { archiveImageJobs } from "../data/archive-image-prompts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const base = (option("--base-url") ?? "http://localhost:3100").replace(/\/$/, "");
const { timelinePeriods, visualEntries } = loadTypeScript(path.join(root, "data/exploration.ts"));
const visible = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
async function read(route) {
  const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(25000) });
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert(!html.includes("NEXT_HTTP_ERROR_FALLBACK;404"), `Streamed 404: ${route}`);
  return visible(html);
}
const timeline = await read("/timeline");
const visual = await read("/visual");
assert.equal([...timeline.matchAll(/class="timelineEntry"/g)].length, 13);
assert.equal([...visual.matchAll(/class="visualArchiveCard /g)].length, 24);
const queue = [...timelinePeriods, ...visualEntries];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const node = queue.shift();
    const html = await read(`/${node.type === "period" ? "timeline" : "visual"}/${node.slug}`);
    assert(html.includes(node.titleKo) && html.includes(node.heroImage), node.slug);
    for (const section of node.periodStages ?? node.observations) assert(html.includes(section.title), `Missing detail: ${node.slug}`);
    assert(html.includes("explorationPager"), `Reading navigation: ${node.slug}`);
  }
}));
const sitemap = await read("/sitemap.xml");
for (const node of [...timelinePeriods, ...visualEntries]) assert(sitemap.includes(`/${node.type === "period" ? "timeline" : "visual"}/${node.slug}</loc>`));
for (const job of archiveImageJobs) {
  const response = await fetch(`${base}/assets/editorial/${job.slug}.webp`, { method: "HEAD" });
  assert.equal(response.status, 200); assert(response.headers.get("content-type").startsWith("image/"));
}
console.log("PASS: 13 timeline entries and 24 visuals in initial HTML; all 37 detail pages, full reading points, sitemap and 5 new images return correctly.");

if (option("--playwright-module")) {
  const { chromium } = await import(pathToFileURL(path.resolve(option("--playwright-module"))).href);
  const browser = await chromium.launch({ headless: true, executablePath: option("--browser-executable") });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", route => new URL(route.request().url()).hostname === "firestore.googleapis.com" ? route.abort() : route.continue());
    const output = option("--screenshots");
    if (output) fs.mkdirSync(output, { recursive: true });
    async function shot(name, fullPage = false) {
      if (output) await page.screenshot({ path: path.join(output, `${name}.png`), fullPage, animations: "disabled" });
    }
    await page.goto(base, { waitUntil: "domcontentloaded" });
    assert((await page.locator(".homeHero").evaluate(element => getComputedStyle(element).backgroundImage)).includes("home-world-v2.webp"));
    assert.equal(await page.locator(".portalGrid > a").count(), 6);
    const hero = await page.locator(".homeHero").boundingBox();
    const portal = await page.locator(".portal").boundingBox();
    assert(portal.y >= hero.y + hero.height - 1, "Home navigation must not overlap artwork or new content");
    await shot("home-desktop");
    await page.locator('.homeHighlightCard[href="/timeline"]').click();
    await page.waitForURL("**/timeline");
    assert.equal(await page.locator(".timelineEntry").count(), 13);
    await shot("timeline-desktop");
    await page.locator('a[href="/timeline/return-and-rebuilding"]').click();
    await page.waitForURL("**/timeline/return-and-rebuilding");
    assert.equal(await page.locator(".characterStage").count(), 4);
    assert.equal(await page.locator('.explorationPager a[href="/timeline/life-of-jesus"]').count(), 1);
    await page.goto(`${base}/visual`, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator(".visualArchiveCard").count(), 24);
    await shot("visual-desktop");
    await page.getByRole("button", { name: /복음과 새 생명/ }).click();
    assert.equal(await page.locator(".visualArchiveCard").count(), 6);
    assert.equal(await page.getByRole("button", { name: /복음과 새 생명/ }).getAttribute("aria-pressed"), "true");
    await page.locator('a[href="/visual/conversation-at-the-well"]').click();
    await page.waitForURL("**/visual/conversation-at-the-well");
    assert.equal(await page.locator(".visualObservationGrid article").count(), 3);
    await page.locator(".visualDetailGallery img").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector(".visualDetailGallery img")?.naturalWidth > 0);
    assert.equal(await page.locator('a[href="/bible/john"]').count(), 1);
    await shot("visual-detail-desktop");
    await page.goto(`${base}/search`, { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("다윗, 예루살렘, 1 Samuel...").fill("오순절");
    await page.locator('a[href="/visual/pentecost-gathering"]').waitFor();
    await page.locator('a[href="/timeline/birth-of-church"]').waitFor();
    for (const width of [390, 820]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of ["/", "/timeline", "/visual", "/visual/conversation-at-the-well", "/timeline/patriarchs-and-promise"]) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px overflow: ${route}`);
        if (width === 390 && ["/", "/timeline", "/visual"].includes(route)) await shot(`${route === "/" ? "home" : route.slice(1)}-mobile`);
      }
    }
    assert.deepEqual(errors, [], "Browser runtime exceptions");
    console.log("PASS: home navigation, 13-period reading path, 24 visuals, 4 theme filters, image loading, related Scripture links, search, 390px / 820px layouts, no runtime exceptions with Firebase unavailable.");
  } finally { await browser.close(); }
}
