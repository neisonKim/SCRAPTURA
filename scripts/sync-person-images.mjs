import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { portraitJobs } from "../data/people/portrait-prompts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const inventory = JSON.parse(fs.readFileSync(path.join(root, "data/people/image-inventory.json"), "utf8"));
const images = { jesus: "/assets/scraptura-jesus.jpg" };
for (const item of inventory.remote) {
  if (inventory.local.some(person => person.slug === item.slug && /scraptura-home/.test(person.heroImage)) && item.heroImage && !/scraptura-home/.test(item.heroImage)) images[item.slug] = item.heroImage;
}
const missing = [];
for (const job of portraitJobs) {
  const image = `/assets/people/${job.slug}.webp`;
  const filename = path.join(root, "public", image);
  if (fs.existsSync(filename) && fs.statSync(filename).size > 0) images[job.slug] = image;
  else missing.push(job.slug);
}
fs.writeFileSync(path.join(root, "data/people/portrait-images.json"), JSON.stringify(images, null, 2) + "\n");
console.log(JSON.stringify({ generated: portraitJobs.length - missing.length, reusedConnections: Object.keys(images).length - (portraitJobs.length - missing.length), missing }));
