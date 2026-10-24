import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { coverJobs } from "../data/bible/cover-prompts.mjs";
import { loadTypeScript } from "./lib/load-typescript.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = relative => loadTypeScript(path.join(root, relative));
const covers = JSON.parse(fs.readFileSync(path.join(root, "data/bible/cover-images.json"), "utf8"));
const { bibleCatalog } = load("data/bible/catalog.ts");
const { nodes, getNode } = load("data/content.ts");
const { getBookCover, applyBookCover } = load("data/bible/images.ts");
const { isDefaultContentImage, preferDedicatedImage } = load("lib/content-images.ts");
const { mergeArchiveRecords } = load("lib/archive-merge.ts");

assert.equal(coverJobs.length, 64);
assert.equal(Object.keys(covers).length, 66);
const hashes = new Set();
let bytes = 0;
for (const job of coverJobs) {
  assert.equal(covers[job.slug], `/assets/bible/${job.slug}.webp`);
  const filename = path.join(root, "public", covers[job.slug]);
  const buffer = fs.readFileSync(filename);
  const metadata = await sharp(buffer).metadata();
  assert.equal(metadata.format, "webp", `${job.slug}: web format`);
  assert(metadata.width >= 1000 && metadata.height >= 600, `${job.slug}: resolution`);
  assert(metadata.width > metadata.height, `${job.slug}: landscape composition`);
  const hash = createHash("sha256").update(buffer).digest("hex");
  assert(!hashes.has(hash), `Duplicate generated image: ${job.slug}`);
  hashes.add(hash);
  bytes += buffer.length;
}
for (const book of bibleCatalog) {
  assert(getBookCover(book.slug), `Missing book cover: ${book.slug}`);
  const node = getNode("book", book.slug);
  assert(!isDefaultContentImage(node.heroImage), `Generic book image: ${book.slug}`);
  assert(fs.existsSync(path.join(root, "public", node.heroImage)), `Broken book image: ${book.slug}`);
}
const stories = nodes.filter(node => node.type === "story");
for (const story of stories) {
  assert(!isDefaultContentImage(story.heroImage), `Generic story image: ${story.slug}`);
  assert(fs.existsSync(path.join(root, "public", story.heroImage)), `Broken story image: ${story.slug}`);
}
assert.equal(getNode("book", "1-samuel").heroImage, "/assets/scraptura-david.jpg");
assert.equal(getNode("story", "david-and-goliath").heroImage, "/assets/scraptura-david-goliath.jpg");
assert.equal(getNode("person", "moses").heroImage, "/assets/people/moses-v2-wide.webp");
assert.equal(getBookCover("book-of-joshua"), getBookCover("joshua"));
assert.equal(getNode("story", "twelve-spies").heroImage, getBookCover("numbers"));
assert.equal(getNode("story", "creation").heroImage, getBookCover("genesis"));
assert.equal(preferDedicatedImage("/assets/scraptura-home-clean.jpg", covers.numbers), covers.numbers);
assert.equal(preferDedicatedImage("https://cdn.example.com/previous-custom.jpg", covers.numbers), "https://cdn.example.com/previous-custom.jpg");
const previous = { slug: "numbers", titleKo: "민수기", order: 4, heroImage: covers.numbers };
assert.equal(mergeArchiveRecords([previous], [{ ...previous, heroImage: "/assets/scraptura-home-clean.jpg" }])[0].heroImage, covers.numbers);
const preserved = { type: "book", slug: "numbers", heroImage: "/custom-existing.jpg" };
assert.equal(applyBookCover(preserved), preserved);
console.log(`PASS: 64 distinct generated WebP covers (${(bytes / 1024 / 1024).toFixed(1)} MiB), 2 reused covers, all 66 books mapped.`);
console.log(`PASS: ${stories.length} story covers resolved; existing images preserved; CMS placeholders do not overwrite new images.`);
