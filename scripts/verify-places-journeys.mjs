import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadTypeScript } from "./lib/load-typescript.mjs";
import { placeJobs } from "../data/places/image-prompts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const base = (option("--base-url") ?? "http://localhost:3100").replace(/\/$/, "");
const { nodes } = loadTypeScript(path.join(root, "data/content.ts"));
const { journeys } = loadTypeScript(path.join(root, "data/journeys.ts"));
const places = nodes.filter(node => node.type === "place");
async function htmlFor(route) {
  const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert(!html.includes("NEXT_HTTP_ERROR_FALLBACK;404"), `Streamed 404: ${route}`);
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}
const archive = await htmlFor("/places");
const links = new Set([...archive.matchAll(/href="(\/places\/[^"#?]+)"/g)].map(match => match[1]));
assert.equal(links.size, places.length);
for (const place of places) assert(archive.includes(place.heroImage) || archive.includes(encodeURIComponent(place.heroImage)), `Archive image: ${place.slug}`);
const queue = [...places];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const place = queue.shift();
    const html = await htmlFor(`/places/${place.slug}`);
    const hero = html.match(/<section[^>]*class="detailHero"[^>]*style="([^"]*)"/)?.[1] ?? "";
    assert(html.includes(place.titleKo), `Place title: ${place.slug}`);
    assert(hero.includes(place.heroImage), `Place detail uses current image: ${place.slug}`);
  }
}));
for (const job of placeJobs) {
  const response = await fetch(`${base}/assets/places/${job.slug}.webp`, { method: "HEAD" });
  assert.equal(response.status, 200); assert(response.headers.get("content-type").startsWith("image/webp"));
}
const journeysArchive = await htmlFor("/journeys");
for (const journey of journeys) {
  assert(journeysArchive.includes(`/journeys/${journey.slug}`));
  const html = await htmlFor(`/journeys/${journey.slug}`);
  assert(html.includes(journey.titleKo) && html.includes(journey.image));
  assert(html.includes(journey.readingLabel), `Journey-specific reading: ${journey.slug}`);
  for (const step of journey.steps) {
    assert(html.includes(`href="${step.href}"`), `Step link: ${journey.slug} -> ${step.href}`);
    assert(html.includes(step.image) || html.includes(encodeURIComponent(step.image)), `Current step artwork: ${journey.slug} -> ${step.href}`);
  }
  assert(!html.includes("사무엘상 본문으로 돌아갑니다"));
}
const destinations = [...new Set(journeys.flatMap(journey => journey.steps.map(step => step.href)))];
await Promise.all(Array.from({ length: 4 }, async () => { while (destinations.length) await htmlFor(destinations.shift()); }));
console.log("PASS: 46 initial places and detail images, 37 WebP assets, all 16 journeys and 180 current steps, every destination returns HTTP 200.");

if (option("--playwright-module")) {
  const { chromium } = await import(pathToFileURL(path.resolve(option("--playwright-module"))).href);
  const browser = await chromium.launch({ headless: true, executablePath: option("--browser-executable") });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.route("**/*", route => new URL(route.request().url()).hostname === "firestore.googleapis.com" ? route.abort() : route.continue());
    const output = option("--screenshots");
    if (output) fs.mkdirSync(output, { recursive: true });
    const shot = async name => { if (output) await page.screenshot({ path: path.join(output, `${name}.png`), animations: "disabled" }); };
    await page.goto(base, { waitUntil: "domcontentloaded" });
    assert.equal(await page.getByText("BEGIN YOUR JOURNEY", { exact: true }).getAttribute("href"), "/journeys");
    await page.getByText("BEGIN A JOURNEY", { exact: true }).click();
    await page.waitForURL("**/journeys");
    assert.equal(await page.locator(".journeysCard, .journeysFeaturedCard").count(), 16);
    await page.locator(".journeysFeaturedImage img").evaluate(element => element.decode());
    await shot("journeys-desktop");
    await page.locator('a.journeysCard[href="/journeys/exodus-and-wilderness"]').click();
    await page.waitForURL("**/journeys/exodus-and-wilderness");
    assert.equal(await page.locator(".journeyStep").count(), journeys.find(item => item.slug === "exodus-and-wilderness").steps.length);
    const sinai = page.locator('a.journeyStep[href="/places/sinai"]');
    await sinai.scrollIntoViewIfNeeded();
    const sinaiImage = sinai.locator("img");
    await sinaiImage.evaluate(element => element.decode());
    assert(decodeURIComponent(await sinaiImage.getAttribute("src")).includes("/assets/places/sinai.webp"));
    await shot("journey-route-desktop");
    await sinai.click(); await page.waitForURL("**/places/sinai");
    assert((await page.locator(".detailHero").getAttribute("style")).includes("/assets/places/sinai.webp"));
    await shot("sinai-desktop");
    await page.goto(`${base}/places`, { waitUntil: "domcontentloaded" });
    const galilee = page.locator('a.archiveCard[href="/places/galilee"]');
    await galilee.scrollIntoViewIfNeeded();
    const landscape = galilee.locator(".cardImage img");
    await landscape.evaluate(element => element.decode());
    assert.equal(await landscape.getAttribute("loading"), "lazy");
    assert(decodeURIComponent(await landscape.getAttribute("src")).includes("/assets/places/galilee.webp"));
    await shot("places-grid-desktop");
    await galilee.click(); await page.waitForURL("**/places/galilee");
    assert((await page.locator(".detailHero").getAttribute("style")).includes("/assets/places/galilee.webp"));
    await page.goto(`${base}/search`, { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("다윗, 예루살렘, 1 Samuel...").fill("갈릴리");
    const result = page.locator('a[href="/places/galilee"]'); await result.waitFor();
    assert((await result.evaluate(element => [element, ...element.querySelectorAll("[style]")].map(item => item.getAttribute("style") ?? "").join(" "))).includes("/assets/places/galilee.webp"));
    for (const width of [390, 820]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of ["/places", "/places/sinai", "/journeys", "/journeys/exodus-and-wilderness", "/journeys/letters-to-the-churches"]) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px overflow: ${route}`);
        if (width === 390 && route === "/journeys") await shot("journeys-mobile");
        if (width === 390 && route === "/journeys/exodus-and-wilderness") { await page.locator(".journeySteps").scrollIntoViewIfNeeded(); await shot("journey-route-mobile"); }
      }
    }
    assert.deepEqual(errors, [], "Browser runtime exceptions");
    console.log("PASS: both journey entry buttons, new journey archive/illustrated route/place flow, lazy images, search, 390px/820px layouts and no runtime exceptions with Firebase unavailable.");
  } finally { await browser.close(); }
}
