import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { placeJobs } from "../data/places/image-prompts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const inventory = JSON.parse(fs.readFileSync(path.join(root, "data/places/image-inventory.json"), "utf8"));
const images = {};
for (const item of inventory.remote) {
  if (item.heroImage && !/scraptura-home/.test(item.heroImage)) images[item.slug] = item.heroImage;
}
const missing = [];
for (const job of placeJobs) {
  const image = `/assets/places/${job.slug}.webp`;
  const filename = path.join(root, "public", image);
  if (fs.existsSync(filename) && fs.statSync(filename).size > 0) images[job.slug] = image;
  else missing.push(job.slug);
}
fs.writeFileSync(path.join(root, "data/places/place-images.json"), JSON.stringify(images, null, 2) + "\n");
console.log(JSON.stringify({ generated: placeJobs.length - missing.length, reused: inventory.remote.length, missing }));
