import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadTypeScript } from "./lib/load-typescript.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const load = name => loadTypeScript(path.join(root, name));
const { nodes, getNode } = load("data/content.ts");
const { bibleCatalog } = load("data/bible/catalog.ts");
const { biblePackageNodes, getBiblePackageNode } = load("data/bible/package-loader.ts");
const { getLocalArchiveRecords } = load("data/archive.ts");
const { mergeArchiveRecords } = load("lib/archive-merge.ts");
const byKey = new Map(nodes.map(node => [`${node.type}:${node.slug}`, node]));
const packageKeys = new Set();
const bookCounts = new Map(bibleCatalog.map(book => [book.titleEn, book.chapterCount]));
// English KJV verse numbering; some translations divide 3 John's last verse differently.
const singleChapterVerses = new Map([["Obadiah", 21], ["Philemon", 25], ["2 John", 13], ["3 John", 14], ["Jude", 25]]);

function referenceSpan(reference) {
  const match = reference.match(/^(.+?) (\d+)(?::(\d+))?(?:[–-](\d+)(?::(\d+))?)?$/);
  assert(match, `Invalid reference: ${reference}`);
  const [, name, start, verse, end, endVerse] = match;
  assert(bookCounts.has(name), `Unknown book in reference: ${reference}`);
  const startChapter = Number(start);
  const startVerse = verse ? Number(verse) : 1;
  const endChapter = end ? (verse && !endVerse ? startChapter : Number(end)) : startChapter;
  const finalVerse = endVerse ? Number(endVerse) : verse ? Number(end || verse) : Infinity;
  assert(startChapter >= 1 && endChapter <= bookCounts.get(name) && endChapter >= startChapter, `Chapter out of range: ${reference}`);
  assert(startVerse >= 1 && (endChapter > startChapter || finalVerse >= startVerse), `Reversed verse range: ${reference}`);
  if (singleChapterVerses.has(name) && finalVerse !== Infinity) assert(finalVerse <= singleChapterVerses.get(name), `Verse out of range: ${reference}`);
  return { startChapter, startVerse, endChapter, finalVerse };
}
function checkStages(stages, key) {
  assert(stages.length > 0, `Missing content stages: ${key}`);
  stages.forEach((stage, index) => {
    assert.equal(stage.number, String(index + 1).padStart(2, "0"), `Stage order: ${key}`);
    for (const field of ["title", "scripture", "description"]) assert(typeof stage[field] === "string" && stage[field].trim(), `Missing ${field}: ${key}`);
  });
}
for (const node of biblePackageNodes) {
  const key = `${node.type}:${node.slug}`;
  assert(!packageKeys.has(key), `Duplicate package node: ${key}`);
  packageKeys.add(key);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(node.slug), `Invalid slug: ${key}`);
  for (const field of ["titleKo", "titleEn", "summary", "overview", "heroImage"]) assert(typeof node[field] === "string" && node[field].trim(), `Missing ${field}: ${key}`);
  assert(!JSON.stringify(node).includes("\ufffd"), `Broken UTF-8: ${key}`);
  assert(fs.existsSync(path.join(root, "public", node.heroImage)), `Missing image: ${key}`);
  assert.equal(getBiblePackageNode(node.type, ` ${node.slug.toUpperCase()} `), node, `Package lookup: ${key}`);
  assert(node.scripture?.length, `Missing scripture: ${key}`);
  if (node.type === "story") checkStages(node.scenes, key);
  if (node.type === "person") checkStages(node.characterJourney, key);
  if (node.type === "book") {
    assert(node.bookSections?.length >= 3, `Book needs a substantive outline: ${key}`);
    checkStages(node.bookSections, key);
    const spans = node.bookSections.map(stage => referenceSpan(stage.scripture));
    assert.equal(spans[0].startChapter, 1, `Book beginning not covered: ${key}`);
    assert.equal(spans[0].startVerse, 1, `Book first verse not covered: ${key}`);
    assert.equal(spans.at(-1).endChapter, bookCounts.get(node.titleEn), `Book ending not covered: ${key}`);
    for (let index = 1; index < spans.length; index++) {
      const previous = spans[index - 1];
      const current = spans[index];
      if (previous.finalVerse === Infinity) assert.equal(current.startChapter, previous.endChapter + 1, `Chapter gap/overlap: ${key}`);
      else if (current.startChapter === previous.endChapter) assert.equal(current.startVerse, previous.finalVerse + 1, `Verse gap/overlap: ${key}`);
      else assert.equal(current.startChapter, previous.endChapter + 1, `Chapter gap: ${key}`);
    }
  }
  for (const relation of node.relations ?? []) {
    assert(byKey.has(`${relation.targetType}:${relation.targetSlug}`), `Broken relation from ${key}: ${relation.targetType}:${relation.targetSlug}`);
    assert.equal(relation.relationType, `RELATED_${relation.targetType.toUpperCase()}`, `Wrong relation type: ${key}`);
  }
}
assert.equal(getBiblePackageNode("story", "unknown-slug"), null);
assert.equal(nodes.length, byKey.size);
assert.equal(getNode("story", "david-and-goliath").scenes.length, 6, "Existing detailed story must be retained");
assert.equal(getNode("book", "genesis").bookSections.length, 7, "Existing Genesis must be retained");
assert.equal(getNode("book", "exodus").bookSections.length, 11, "Existing Exodus must be retained");
const archive = getLocalArchiveRecords();
const books = getLocalArchiveRecords("book");
assert.equal(books.length, 66);
assert.deepEqual(books.map(book => book.slug), bibleCatalog.map(book => book.slug));
assert(archive.some(item => item.slug === "balaam") && archive.some(item => item.slug === "new-jerusalem"), "Entities must be discoverable in search");
const localBook = books.find(book => book.slug === "numbers");
const merged = mergeArchiveRecords(books, [{ ...localBook, titleKo: "Remote title", order: 9999 }]);
assert.equal(merged.length, 66, "Remote/local records must not duplicate");
assert.equal(merged[3].titleKo, "Remote title", "Published remote fields should win without changing canonical order");
const matchingTypes = archive.filter(item => item.slug === "joshua");
assert(matchingTypes.some(item => item.type === "person") && matchingTypes.some(item => item.type === "book"));
assert.equal(mergeArchiveRecords(matchingTypes, matchingTypes, item => `${item.type}:${item.slug}`).length, 2, "Search must retain different types with the same slug");
const counts = nodes.reduce((result, node) => ({ ...result, [node.type]: (result[node.type] ?? 0) + 1 }), {});
console.log(`PASS: 66 canonical books, ${biblePackageNodes.length} package nodes, all package relations resolve.`);
console.log(`PASS: chapter coverage, stage order, UTF-8, images, preserved legacy content, archive merge/search.`);
console.log(`All content nodes: ${JSON.stringify(counts)}.`);
