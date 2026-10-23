import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { portraitJobs } from "../data/people/portrait-prompts.mjs";
import { loadTypeScript } from "./lib/load-typescript.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
const base = (option("--base-url") ?? "http://localhost:3100").replace(/\/$/, "");
const { nodes } = loadTypeScript(path.join(root, "data/content.ts"));
const people = nodes.filter(node => node.type === "person");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "data/people/image-inventory.json"), "utf8"));
const previous = new Map(inventory.remote.map(person => [person.slug, person.heroImage]));
async function htmlFor(route) {
  const response = await fetch(`${base}${route}`, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert(!html.includes("NEXT_HTTP_ERROR_FALLBACK;404"), `Streamed 404: ${route}`);
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}
const archive = await htmlFor("/people");
const archiveLinks = new Set([...archive.matchAll(/href="(\/people\/[^"#?]+)"/g)].map(match => match[1]));
assert.equal(archiveLinks.size, people.length);
for (const job of portraitJobs) {
  const image = `/assets/people/${job.slug}.webp`;
  assert(archive.includes(image) || archive.includes(encodeURIComponent(image)), `Missing archive portrait: ${job.slug}`);
}
const queue = [...people];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const person = queue.shift();
    const html = await htmlFor(`/people/${person.slug}`);
    const hero = html.match(/<section[^>]*class="detailHero"[^>]*style="([^"]*)"/)?.[1] ?? "";
    assert(html.includes(person.titleKo), `Person title: ${person.slug}`);
    assert([person.heroImage, previous.get(person.slug)].filter(Boolean).some(image => hero.includes(image)), `Wrong person hero: ${person.slug}`);
    if (person.heroImage.startsWith("/assets/people/")) {
      assert(hero.includes(person.heroImage), `New portrait hidden: ${person.slug}`);
      assert(html.includes(person.heroImage), `Missing shared preview: ${person.slug}`);
    }
  }
}));
for (const job of portraitJobs) {
  const response = await fetch(`${base}/assets/people/${job.slug}.webp`, { method: "HEAD" });
  assert.equal(response.status, 200); assert(response.headers.get("content-type").startsWith("image/"));
}
console.log(`PASS: ${people.length} people in initial archive, all person detail titles/hero images, 70 generated image URLs, previous CMS images preserved.`);

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
    async function shot(name) {
      if (output) await page.screenshot({ path: path.join(output, `${name}.png`), animations: "disabled" });
    }
    for (const slug of ["ruth", "paul", "aaron", "mary-magdalene", "joshua"]) {
      await page.goto(`${base}/people`, { waitUntil: "domcontentloaded" });
      const card = page.locator(`a[href="/people/${slug}"]`);
      await card.scrollIntoViewIfNeeded();
      const image = `/assets/people/${slug}.webp`;
      const portrait = card.locator(".cardImage img");
      assert(decodeURIComponent(await portrait.getAttribute("src")).includes(image));
      assert.equal(await portrait.getAttribute("loading"), "lazy");
      await portrait.evaluate(element => element.decode());
      if (slug === "ruth") await shot("people-grid-desktop");
      await card.click(); await page.waitForURL(`**/people/${slug}`);
      assert((await page.locator(".detailHero").getAttribute("style")).includes(image));
      assert(await page.locator(".characterStage").count() > 0, `Existing person content remains: ${slug}`);
      if (slug === "ruth") await shot("ruth-desktop");
    }
    await page.goto(`${base}/search`, { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("다윗, 예루살렘, 1 Samuel...").fill("디모데");
    const result = page.locator('a[href="/people/timothy"]');
    await result.waitFor();
    const styles = await result.evaluate(element => [element, ...element.querySelectorAll("[style]")].map(item => item.getAttribute("style") ?? "").join(" "));
    assert(styles.includes("/assets/people/timothy.webp"), "Search uses the new person portrait");
    for (const width of [390, 820]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of ["/people", "/people/ruth", "/people/paul"]) {
        await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px overflow: ${route}`);
        if (width === 390 && route === "/people/ruth") await shot("ruth-mobile");
      }
    }
    assert.deepEqual(errors, [], "Browser runtime exceptions");
    console.log("PASS: person card/detail consistency, existing character journeys, search portraits, 390px and 820px layouts, no runtime exceptions with Firebase unavailable.");
  } finally { await browser.close(); }
}
