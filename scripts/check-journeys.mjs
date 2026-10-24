import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadTypeScript } from "./lib/load-typescript.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const { journeys, getJourney } = loadTypeScript(path.join(root, "data/journeys.ts"));
const { nodes } = loadTypeScript(path.join(root, "data/content.ts"));
const { bibleCatalog } = loadTypeScript(path.join(root, "data/bible/catalog.ts"));
const routes = { person: "people", story: "stories", place: "places", period: "timeline", book: "bible", visual: "visual" };
const addresses = new Map(nodes.map(node => [`/${routes[node.type]}/${node.slug}`, node]));
const books = new Set(); let steps = 0;
assert.equal(journeys.length, 16);
assert.equal(new Set(journeys.map(item => item.slug)).size, 16);
assert(getJourney("rise-of-david") && getJourney("birth-of-the-kingdom"), "Existing journey URLs preserved");
for (const [index, journey] of journeys.entries()) {
  assert.equal(journey.number, String(index + 1).padStart(2, "0"));
  assert(journey.image.endsWith(".webp") && fs.existsSync(path.join(root, "public", journey.image)));
  assert(journey.steps.length >= 6);
  assert.equal(new Set(journey.steps.map(step => step.href)).size, journey.steps.length);
  assert(addresses.has(journey.returnHref));
  assert(journey.readingLabel.length > 0);
  for (const step of journey.steps) {
    const current = addresses.get(step.href);
    assert(current, `Broken step: ${journey.slug} -> ${step.href}`);
    assert.equal(step.image, current.heroImage);
    assert.equal(step.description, current.summary);
    assert(step.description.length > 15);
    if (current.type === "book") books.add(current.slug);
    steps++;
  }
}
assert.deepEqual([...books].sort(), bibleCatalog.map(book => book.slug).sort(), "All 66 books accessible through journeys");
console.log(`PASS: 16 updated journeys, ${steps} current illustrated steps, all 66 books linked, original URLs preserved and no broken content links.`);
