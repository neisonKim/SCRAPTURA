import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { coverJobs } from "../data/bible/cover-prompts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const covers = { exodus: "/assets/scraptura-exodus.jpg", "1-samuel": "/assets/scraptura-david.jpg" };
const missing = [];
for (const job of coverJobs) {
  const relative = `/assets/bible/${job.slug}.webp`;
  if (fs.existsSync(path.join(root, "public", relative)) && fs.statSync(path.join(root, "public", relative)).size > 0) covers[job.slug] = relative;
  else missing.push(job.slug);
}
fs.writeFileSync(path.join(root, "data/bible/cover-images.json"), `${JSON.stringify(covers, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ generated: coverJobs.length - missing.length, reused: 2, mapped: Object.keys(covers).length, missing }));
