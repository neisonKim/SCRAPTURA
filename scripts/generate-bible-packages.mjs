import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import history from "../data/bible/source/old-testament-history.mjs";
import wisdomAndProphets from "../data/bible/source/old-testament-wisdom-prophets.mjs";
import newTestament from "../data/bible/source/new-testament.mjs";
import { people, places } from "../data/bible/source/entities.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalogSource = fs.readFileSync(path.join(root, "data/bible/catalog.ts"), "utf8");
const catalog = [...catalogSource.matchAll(/\["([^"]+)", "([^"]+)", "([^"]+)", (\d+), "(OLD|NEW)"\]/g)]
  .map(([, slug, titleKo, titleEn, chapters, testament], index) => ({ slug, titleKo, titleEn, chapters: Number(chapters), testament, order: index + 1 }));
if (catalog.length !== 66) throw new Error("Expected the canonical 66-book catalog.");
const outlines = [...history, ...wisdomAndProphets, ...newTestament];
if (outlines.length !== 63 || new Set(outlines.map(book => book.slug)).size !== 63) throw new Error("Expected 63 distinct new book outlines.");
const image = "/assets/scraptura-home-clean.jpg";
const covers = JSON.parse(fs.readFileSync(path.join(root, "data/bible/cover-images.json"), "utf8"));
const portraits = JSON.parse(fs.readFileSync(path.join(root, "data/people/portrait-images.json"), "utf8"));
const codes = "GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split(" ");
const packages = new Map(outlines.map(outline => [outline.slug, { sources: [{ title: "Biblical text (KJV, public domain)", url: `https://ebible.org/eng-kjv/${codes[catalog.findIndex(book => book.slug === outline.slug)]}01.htm` }], nodes: [] }]));
const relation = (type, slug, label) => ({ targetType: type, targetSlug: slug, relationType: `RELATED_${type === "person" ? "PERSON" : type.toUpperCase()}`, label });
const labels = new Map([...people.map(([slug, ko]) => [`person:${slug}`, ko]), ...places.map(([slug, ko]) => [`place:${slug}`, ko]), ...catalog.map(book => [`book:${book.slug}`, book.titleKo])]);
// Existing detailed nodes remain in content.ts; only their labels are needed here.
for (const [slug, ko] of [["moses", "모세"], ["joshua", "여호수아"], ["rahab", "라합"], ["samuel", "사무엘"], ["saul", "사울"], ["david", "다윗"], ["abraham", "아브라함"]]) labels.set(`person:${slug}`, ko);
for (const [slug, ko] of [["sinai", "시내산"], ["jericho", "여리고"], ["gilgal", "길갈"], ["shechem", "세겜"], ["bethel", "벧엘"], ["bethlehem", "베들레헴"], ["valley-of-elah", "엘라 골짜기"], ["hebron", "헤브론"], ["jerusalem", "예루살렘"], ["egypt", "이집트"]]) labels.set(`place:${slug}`, ko);
function related(type, slug) {
  const label = labels.get(`${type}:${slug}`);
  if (!label) throw new Error(`Missing relation label: ${type}:${slug}`);
  return relation(type, slug, label);
}
function section(row, index, titleEn) {
  const [reference, title, description] = row.split("|");
  if (!reference || !title || !description) throw new Error(`Invalid source section: ${row}`);
  return { number: String(index + 1).padStart(2, "0"), title, scripture: `${titleEn} ${reference}`, description };
}
for (const outline of outlines) {
  const book = catalog.find(item => item.slug === outline.slug);
  if (!book) throw new Error(`Unknown book: ${outline.slug}`);
  const bookSections = outline.sections.map((row, index) => section(row, index, book.titleEn));
  const links = [...outline.people.map(slug => related("person", slug)), ...outline.places.map(slug => related("place", slug))];
  const stories = (outline.features ?? []).map(([slug, titleKo, ...rows]) => ({ slug, titleKo, scenes: rows.map((row, index) => section(row, index, book.titleEn)), narrative: true }));
  for (const [slug, titleKo, start, end] of outline.highlights ?? []) {
    const scenes = bookSections.slice(start, end + 1).map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") }));
    if (scenes.length < 2) throw new Error(`A reading must include multiple text sections: ${slug}`);
    stories.push({ slug, titleKo, scenes, narrative: false });
  }
  packages.get(book.slug).nodes.push({
    type: "book", slug: book.slug, titleKo: book.titleKo, titleEn: book.titleEn,
    eyebrow: `BIBLE · ${book.testament === "OLD" ? "OLD" : "NEW"} TESTAMENT`,
    summary: outline.summary, overview: `${outline.summary} ${bookSections.map(item => item.description).join(" ")}`,
    biblicalContext: outline.context, heroImage: covers[book.slug] ?? image, bookSections,
    scripture: [`${book.titleEn} ${book.chapters === 1 ? "1" : `1–${book.chapters}`}`],
    relations: [...links, ...stories.map(story => relation("story", story.slug, story.titleKo)), ...[catalog[book.order - 2], catalog[book.order]].filter(Boolean).map(item => related("book", item.slug))]
  });
  for (const story of stories) {
    packages.get(book.slug).nodes.push({
      type: "story", slug: story.slug, titleKo: story.titleKo, titleEn: story.slug.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" "),
      eyebrow: `${story.narrative ? "STORIES" : "SCRIPTURE STUDY"} · ${book.titleEn.toUpperCase()}`,
      summary: story.scenes.map(item => item.description).join(" "),
      overview: `${book.titleKo}의 ${story.scenes.map(item => item.scripture.replace(`${book.titleEn} `, "")).join(", ")} 본문을 따라 ${story.titleKo}의 내용을 살펴봅니다. ${outline.context}`,
      heroImage: covers[book.slug] ?? image, scenes: story.scenes, scripture: story.scenes.map(item => item.scripture),
      relations: [related("book", book.slug), ...links]
    });
  }
}
function attachEntities(type, rows) {
  for (const [slug, titleKo, titleEn, summary, ...references] of rows) {
    const associated = outlines.filter(outline => outline[type === "person" ? "people" : "places"].includes(slug));
    if (!associated.length) throw new Error(`Unused entity: ${type}:${slug}`);
    const node = { type, slug, titleKo, titleEn, eyebrow: type === "person" ? "PEOPLE · BIBLICAL ARCHIVE" : "PLACES · BIBLICAL WORLD", summary, overview: summary, heroImage: type === "person" ? portraits[slug] ?? image : image, scripture: [], relations: associated.map(book => related("book", book.slug)) };
    if (type === "person") {
      node.characterJourney = references.map((row, index) => {
        const [scripture, title, description] = row.split("|");
        if (!scripture || !title || !description) throw new Error(`Invalid person stage: ${slug}`);
        return { number: String(index + 1).padStart(2, "0"), title, scripture, description };
      });
      node.scripture = node.characterJourney.map(item => item.scripture);
      node.overview = `${summary} ${node.characterJourney.map(item => item.description).join(" ")}`;
    } else {
      node.scripture = references;
      node.biblicalContext = summary;
      node.keyEvent = { title: `${titleKo}의 성경 속 배경`, scripture: references[0], description: summary };
    }
    packages.get(associated[0].slug).nodes.push(node);
  }
}
attachEntities("person", people);
attachEntities("place", places);
const destination = path.join(root, "data/bible/books");
fs.mkdirSync(destination, { recursive: true });
for (const [slug, biblePackage] of packages) fs.writeFileSync(path.join(destination, `${slug}.json`), `${JSON.stringify(biblePackage, null, 2)}\n`, "utf8");
const registered = catalog.filter(book => fs.existsSync(path.join(destination, `${book.slug}.json`)));
const registry = `// Generated by scripts/generate-bible-packages.mjs.\nimport type { ContentNode } from "../content-types";\n${registered.map((book, index) => `import package${index} from "./books/${book.slug}.json";`).join("\n")}\n\nexport const biblePackages = [\n${registered.map((_, index) => `  package${index},`).join("\n")}\n] as unknown as { nodes: ContentNode[] }[];\n`;
fs.writeFileSync(path.join(root, "data/bible/package-registry.ts"), registry, "utf8");
console.log(`Generated ${packages.size} book packages; registered ${registered.length} packages (${registered.length + 2} books including legacy Genesis/Exodus).`);
console.log(`New package nodes: ${[...packages.values()].reduce((total, item) => total + item.nodes.length, 0)}.`);
