import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { portraitJobs } from "../data/people/portrait-prompts.mjs";
import { loadTypeScript } from "./lib/load-typescript.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = relative => loadTypeScript(path.join(root, relative));
const { nodes, getNode } = load("data/content.ts");
const { getBiblePackageNode } = load("data/bible/package-loader.ts");
const { getLocalArchiveRecords } = load("data/archive.ts");
const { applyPersonPortrait } = load("data/people/images.ts");
const { isDefaultContentImage, preferDedicatedImage } = load("lib/content-images.ts");
const { mergeArchiveRecords } = load("lib/archive-merge.ts");
const inventory = JSON.parse(fs.readFileSync(path.join(root, "data/people/image-inventory.json"), "utf8"));
const images = JSON.parse(fs.readFileSync(path.join(root, "data/people/portrait-images.json"), "utf8"));
const originalRemote = new Map(inventory.remote.map(person => [person.slug, person.heroImage]));
const people = nodes.filter(node => node.type === "person");
assert.equal(people.length, inventory.local.length);
assert.equal(portraitJobs.length, 70);
assert.equal(Object.keys(images).length, 73);
const hashes = new Set();
let bytes = 0;
for (const job of portraitJobs) {
  assert(!originalRemote.get(job.slug), `A published image already exists: ${job.slug}`);
  const previous = inventory.local.find(person => person.slug === job.slug);
  assert(previous && isDefaultContentImage(previous.heroImage), `Preserve original local portrait: ${job.slug}`);
  const image = `/assets/people/${job.slug}.webp`;
  assert.equal(images[job.slug], image);
  const buffer = fs.readFileSync(path.join(root, "public", image));
  const metadata = await sharp(buffer).metadata();
  assert.equal(metadata.format, "webp");
  assert(metadata.width >= 1000 && metadata.height >= 600 && metadata.width > metadata.height, `Portrait resolution: ${job.slug}`);
  const hash = createHash("sha256").update(buffer).digest("hex");
  assert(!hashes.has(hash), `Duplicate portrait: ${job.slug}`);
  hashes.add(hash); bytes += buffer.length;
  assert.equal(getNode("person", job.slug).heroImage, image);
}
const existingPaths = new Set(["/assets/scraptura-jesus.jpg"]);
for (const previous of inventory.local) {
  const current = getNode("person", previous.slug);
  assert(!isDefaultContentImage(current.heroImage), `Still using generic image: ${previous.slug}`);
  if (!isDefaultContentImage(previous.heroImage)) {
    assert.equal(current.heroImage, previous.slug === "moses" ? "/assets/people/moses-v2-wide.webp" : previous.heroImage, `Only the requested Moses portrait may change: ${previous.slug}`);
    if (previous.heroImage.startsWith("/")) existingPaths.add(previous.heroImage);
  }
  if (current.heroImage.startsWith("/")) assert(fs.existsSync(path.join(root, "public", current.heroImage)));
  else assert.equal(current.heroImage, originalRemote.get(previous.slug), `Unexpected remote image: ${previous.slug}`);
}
for (const image of existingPaths) {
  const oldBuffer = execFileSync("git", ["show", `HEAD:public${image}`], { cwd: root, maxBuffer: 10 * 1024 * 1024 });
  assert(fs.readFileSync(path.join(root, "public", image)).equals(oldBuffer), `Existing image file modified: ${image}`);
}
for (const slug of ["abraham", "noah"]) assert.equal(getNode("person", slug).heroImage, originalRemote.get(slug));
assert.equal(getNode("person", "jesus").heroImage, "/assets/scraptura-jesus.jpg");
assert.equal(getBiblePackageNode("person", "aaron").heroImage, images.aaron);
assert.equal(getBiblePackageNode("person", "jesus").heroImage, images.jesus);
assert.equal(getLocalArchiveRecords("person").length, people.length);
const local = getLocalArchiveRecords("person").find(person => person.slug === "ruth");
assert.equal(mergeArchiveRecords([local], [{ ...local, heroImage: "/assets/scraptura-home-clean.jpg" }])[0].heroImage, images.ruth);
assert.equal(preferDedicatedImage(originalRemote.get("david"), images.ruth), originalRemote.get("david"));
const preserved = { type: "person", slug: "ruth", heroImage: "/custom-existing.jpg" };
assert.equal(applyPersonPortrait(preserved), preserved);
console.log(`PASS: 70 distinct generated portraits (${(bytes / 1024 / 1024).toFixed(1)} MiB); all ${people.length} local people have images.`);
console.log("PASS: Moses uses the requested new WebP portrait; previous files and other portraits are preserved; package/detail/archive/search fallbacks resolve.");
