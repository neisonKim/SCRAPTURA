import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { coverJobs } from "../data/bible/cover-prompts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const value = name => args[args.indexOf(name) + 1];
const slug = value("--slug");
const source = value("--source");
if (!coverJobs.some(job => job.slug === slug) || !source) throw new Error("A known cover slug and generated source path are required.");
const destination = path.join(root, "public/assets/bible", `${slug}.webp`);
fs.mkdirSync(path.dirname(destination), { recursive: true });
if (fs.existsSync(destination)) throw new Error(`Refusing to overwrite existing image: ${slug}`);
const metadata = await sharp(source).metadata();
if (metadata.width < 1000 || metadata.height < 600) throw new Error(`Generated image is too small: ${slug}`);
// Format optimization only: retain the generated composition and original resolution.
await sharp(source).webp({ quality: 86, effort: 6 }).toFile(destination);
console.log(JSON.stringify({ slug, path: destination, width: metadata.width, height: metadata.height, bytes: fs.statSync(destination).size }));
