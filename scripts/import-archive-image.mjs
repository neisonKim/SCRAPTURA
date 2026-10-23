import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { archiveImageJobs } from "../data/archive-image-prompts.mjs";

const args = process.argv.slice(2);
const slug = args[args.indexOf("--slug") + 1];
const source = args[args.indexOf("--source") + 1];
if (!archiveImageJobs.some(job => job.slug === slug) || !source) throw new Error("Known image slug and source required");
const root = fileURLToPath(new URL("../", import.meta.url));
const target = path.join(root, "public/assets/editorial", `${slug}.webp`);
if (fs.existsSync(target)) throw new Error("Existing final image must be reviewed before replacement");
fs.mkdirSync(path.dirname(target), { recursive: true });
const metadata = await sharp(source).metadata();
if (metadata.width < 1500 || metadata.height < 600) throw new Error("Hero image resolution is insufficient");
await sharp(source).webp({ quality: 89, effort: 6 }).toFile(target);
console.log(JSON.stringify({ slug, target, width: metadata.width, height: metadata.height, bytes: fs.statSync(target).size }));
