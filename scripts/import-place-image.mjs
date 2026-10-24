import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { placeJobs } from "../data/places/image-prompts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const slug = args[args.indexOf("--slug") + 1];
const source = args[args.indexOf("--source") + 1];
if (!placeJobs.some(job => job.slug === slug) || !source) throw new Error("Known place and generated source required");
const target = path.join(root, "public/assets/places", `${slug}.webp`);
if (fs.existsSync(target)) throw new Error(`Preserve existing place image: ${slug}`);
const metadata = await sharp(source).metadata();
if (metadata.width < 1000 || metadata.height < 600 || metadata.width <= metadata.height) throw new Error(`Unsuitable place dimensions: ${slug}`);
fs.mkdirSync(path.dirname(target), { recursive: true });
await sharp(source).webp({ quality: 87, effort: 6 }).toFile(target);
console.log(JSON.stringify({ slug, path: target, width: metadata.width, height: metadata.height, bytes: fs.statSync(target).size }));
