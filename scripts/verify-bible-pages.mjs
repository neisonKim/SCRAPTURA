import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadTypeScript } from "./lib/load-typescript.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const base = (option("--base-url") ?? "http://localhost:3100").replace(/\/$/, "");
const { bibleCatalog } = loadTypeScript(path.join(root, "data/bible/catalog.ts"));
const { getNode } = loadTypeScript(path.join(root, "data/content.ts"));

async function htmlFor(route) {
  const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(25000) });
  assert.equal(response.status, 200, `${route}: HTTP ${response.status}`);
  const html = await response.text();
  assert(!html.includes("NEXT_HTTP_ERROR_FALLBACK;404"), `${route}: streamed 404`);
  return html;
}
const archive = await htmlFor("/bible");
const paths = new Set([...archive.matchAll(/href="(\/bible\/[^"#?]+)"/g)].map(match => match[1]));
assert.equal(paths.size, 66, "Bible archive should render 66 canonical links before Firebase loads");
let verified = 0;
const queue = [...bibleCatalog];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const book = queue.shift();
    const html = await htmlFor(`/bible/${book.slug}`);
    const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert(visible.includes(book.titleKo), `Missing title: ${book.slug}`);
    assert(visible.includes("BOOK JOURNEY"), `Missing outline: ${book.slug}`);
    assert(visible.includes(getNode("book", book.slug).heroImage), `Wrong book hero image: ${book.slug}`);
    verified++;
  }
}));
console.log(`PASS: /bible renders 66 links; all ${verified} book pages return 200 with title and Book Journey.`);
for (const [type, slug, prefix] of [
  ["person", "balaam", "people"], ["person", "jesus", "people"],
  ["place", "new-jerusalem", "places"], ["place", "kadesh", "places"],
  ["story", "twelve-spies", "stories"], ["story", "bronze-serpent", "stories"],
  ["story", "romans-spirit-and-welcome", "stories"], ["story", "new-jerusalem-and-life", "stories"]
]) {
  const html = await htmlFor(`/${prefix}/${slug}`);
  assert(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").includes(getNode(type, slug).titleKo), `Missing detail: ${type}:${slug}`);
}
const sitemap = await htmlFor("/sitemap.xml");
for (const book of bibleCatalog) assert(sitemap.includes(`/bible/${book.slug}</loc>`), `Missing sitemap book: ${book.slug}`);
console.log("PASS: 8 representative person/place/story pages and 66 sitemap book URLs.");

const coverManifest = path.join(root, "data/bible/cover-images.json");
if (fs.existsSync(coverManifest)) {
  const imageQueue = [...new Set(Object.values(JSON.parse(fs.readFileSync(coverManifest, "utf8"))))];
  const imageCount = imageQueue.length;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (imageQueue.length) {
      const image = imageQueue.shift();
      const response = await fetch(`${base}${image}`, { method: "HEAD", signal: AbortSignal.timeout(10000) });
      assert.equal(response.status, 200, `Missing served image: ${image}`);
      assert(response.headers.get("content-type")?.startsWith("image/"), `Wrong image MIME type: ${image}`);
    }
  }));
  console.log(`PASS: ${imageCount} distinct cover URLs served as images.`);
}

const playwrightModule = option("--playwright-module");
if (playwrightModule) {
  const { chromium } = await import(pathToFileURL(path.resolve(playwrightModule)).href);
  const browser = await chromium.launch({ headless: true, executablePath: option("--browser-executable") });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    // A failed remote service must not hide the newly bundled public content.
    await page.route("**/*", route => new URL(route.request().url()).hostname === "firestore.googleapis.com" ? route.abort() : route.continue());
    await page.goto(`${base}/bible`, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator('a[href^="/bible/"]').count(), 66);
    await page.locator('a[href="/bible/numbers"]').click();
    await page.waitForURL("**/bible/numbers");
    await page.getByRole("heading", { name: "민수기", exact: true }).waitFor();
    assert.equal(await page.locator(".characterJourneyList .characterStage").count(), 10);
    const numbersImage = getNode("book", "numbers").heroImage;
    assert((await page.locator(".detailHero").getAttribute("style")).includes(numbersImage), "Numbers should render its generated cover");
    await page.goto(`${base}/stories`, { waitUntil: "domcontentloaded" });
    const storyCard = page.locator('a[href="/stories/twelve-spies"]');
    await storyCard.waitFor();
    const cardStyles = await storyCard.evaluate(element => [element, ...element.querySelectorAll("[style]")].map(item => item.getAttribute("style") ?? "").join(" "));
    assert(cardStyles.includes(numbersImage), "Story card should share the related book cover");
    await storyCard.click();
    await page.waitForURL("**/stories/twelve-spies");
    assert((await page.locator(".detailHero").getAttribute("style")).includes(numbersImage), "Story detail should share the related book cover");
    await page.goto(`${base}/search`, { waitUntil: "domcontentloaded" });
    const search = page.getByPlaceholder("다윗, 예루살렘, 1 Samuel...");
    await search.fill("발람");
    await page.locator('a[href="/people/balaam"]').waitFor();
    await search.fill("요한계시록");
    await page.locator('a[href="/bible/revelation"]').waitFor();
    await page.getByRole("button", { name: "BIBLE", exact: true }).click();
    assert.equal(await page.locator('a[href="/bible/revelation"]').count(), 1);
    await page.goto(`${base}/bible/revelation`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "요한계시록", exact: true }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Mobile page overflows horizontally");
    if (option("--screenshot")) await page.screenshot({ path: option("--screenshot"), fullPage: true });
    assert.deepEqual(errors, [], "Browser runtime errors");
    console.log("PASS: browser archive navigation, shared book/story covers, 10 Numbers sections, live search/type filter, mobile width, no runtime exceptions (Firebase unavailable).");
  } finally {
    await browser.close();
  }
}
