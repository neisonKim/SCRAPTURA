import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { loadTypeScript } from "./lib/load-typescript.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
nextEnv.loadEnvConfig(root, true, { info() {}, error() {} });
const { nodes } = loadTypeScript(path.join(root, "data/content.ts"));
const people = nodes.filter(node => node.type === "person");
const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (!project || !key) throw new Error("Public Firebase configuration missing");
const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents:runQuery?key=${encodeURIComponent(key)}`;
let response;
try {
  response = await fetch(endpoint, {
    method: "POST", headers: { "content-type": "application/json" }, signal: AbortSignal.timeout(25000),
    body: JSON.stringify({ structuredQuery: {
      from: [{ collectionId: "contents" }],
      select: { fields: ["type", "slug", "titleKo", "heroImage"].map(fieldPath => ({ fieldPath })) },
      where: { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "published" } } },
    } }),
  });
} catch (error) { throw new Error(`Public image inventory request failed: ${error.cause?.code ?? error.name}`); }
if (!response.ok) throw new Error(`Public image inventory returned HTTP ${response.status}`);
const rows = await response.json();
const remote = rows.flatMap(row => {
  const data = row.document?.fields;
  if (data?.type?.stringValue !== "person") return [];
  return [{ slug: data.slug?.stringValue, titleKo: data.titleKo?.stringValue, heroImage: data.heroImage?.stringValue ?? "" }];
});
const target = path.join(root, "data/people/image-inventory.json");
if (fs.existsSync(target)) throw new Error("Original inventory already exists; preserve it");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify({ local: people.map(({ slug, titleKo, titleEn, heroImage }) => ({ slug, titleKo, titleEn, heroImage })), remote }, null, 2) + "\n");
console.log(JSON.stringify({ local: people.length, publishedRemote: remote.length, remoteImages: remote }, null, 2));
