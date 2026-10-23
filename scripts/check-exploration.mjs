import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { loadTypeScript } from "./lib/load-typescript.mjs";
import { archiveImageJobs } from "../data/archive-image-prompts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const { timelinePeriods, visualEntries } = loadTypeScript(path.join(root, "data/exploration.ts"));
const { nodes } = loadTypeScript(path.join(root, "data/content.ts"));
const { getLocalArchiveRecords } = loadTypeScript(path.join(root, "data/archive.ts"));
const keys = new Set(nodes.map(node => `${node.type}:${node.slug}`));
assert.equal(keys.size, nodes.length, "No duplicate content addresses");
assert.equal(timelinePeriods.length, 13);
assert.equal(visualEntries.length, 24);
for (const node of [...timelinePeriods, ...visualEntries]) {
  assert(!JSON.stringify(node).includes("\ufffd"), `UTF-8: ${node.slug}`);
  assert(node.overview.length > 80 && node.scripture.length >= 3, `Substantive content: ${node.slug}`);
  const image = await sharp(path.join(root, "public", node.heroImage)).metadata();
  assert(image.width >= 1500 && image.height >= 600, `Image resolution: ${node.slug}`);
  for (const relation of node.relations) assert(keys.has(`${relation.targetType}:${relation.targetSlug}`), `Broken relation: ${node.slug} -> ${relation.targetSlug}`);
  if (node.type === "period") {
    assert.equal(node.periodStages.length, 4, `Four turning points: ${node.slug}`);
    node.periodStages.forEach((stage, index) => assert.equal(stage.number, String(index + 1).padStart(2, "0")));
  } else assert.equal(node.observations.length, 3, `Three distinct reading points: ${node.slug}`);
}
assert.deepEqual(getLocalArchiveRecords("period").map(node => node.slug), timelinePeriods.map(node => node.slug), "Timeline search order");
assert.equal(getLocalArchiveRecords("visual").length, 24);
for (const job of archiveImageJobs) {
  const image = await sharp(path.join(root, "public/assets/editorial", `${job.slug}.webp`)).metadata();
  assert(image.width >= 1500 && image.width > image.height);
}
assert(fs.readFileSync(path.join(root, "app/exploration.css"), "utf8").includes("home-world-v2.webp"));
console.log("PASS: 13 chronological periods, 52 turning points, 24 visuals, 72 reading points, all relations and high-resolution images, archive/search registration.");
console.log("PASS: 5 new ImageGen assets saved as WebP; no broken or duplicate content addresses.");
