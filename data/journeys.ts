import { nodes } from "./content";
import type { ContentNode, ContentType } from "./content-types";
import { timelinePeriods, visualEntries } from "./exploration";

export type JourneyStep = {
  label: "PERSON" | "STORY" | "PLACE" | "PERIOD" | "SCRIPTURE" | "VISUAL";
  title: string; href: string; description: string; image: string; scripture: string;
};
export type Journey = {
  slug: string; number: string; label: string; titleKo: string; titleEn: string;
  description: string; image: string; steps: JourneyStep[];
  readingLabel: string; returnHref: string; returnLabel: string;
};
type Target = [ContentType, string];
const routes: Record<ContentType, string> = { person: "people", story: "stories", place: "places", period: "timeline", book: "bible", visual: "visual" };
const labels: Record<ContentType, JourneyStep["label"]> = { person: "PERSON", story: "STORY", place: "PLACE", period: "PERIOD", book: "SCRIPTURE", visual: "VISUAL" };

function nodeFor([type, slug]: Target): ContentNode {
  const node = nodes.find(item => item.type === type && item.slug === slug);
  if (!node) throw new Error(`Journey content missing: ${type}:${slug}`);
  return node;
}
function stepsFor(targets: Target[]): JourneyStep[] {
  const seen = new Set<string>();
  return targets.filter(([type, slug]) => {
    const key = `${type}:${slug}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).map(target => {
    const node = nodeFor(target);
    return { label: labels[node.type], title: node.titleKo, href: `/${routes[node.type]}/${node.slug}`, description: node.summary, image: node.heroImage, scripture: node.scripture?.[0] ?? "" };
  });
}

// Resolve the current archive content so images and summaries remain synchronized.
const periodExtras: Record<string, { places: string[]; books: string[] }> = {
  "creation-and-beginnings": { places: [], books: ["genesis"] },
  "patriarchs-and-promise": { places: ["bethel", "egypt"], books: ["genesis"] },
  "exodus-and-wilderness": { places: ["sinai", "mount-nebo"], books: ["exodus", "leviticus", "numbers", "deuteronomy"] },
  "conquest-and-judges": { places: ["jordan-river", "jericho", "shechem"], books: ["joshua", "judges", "ruth"] },
  "rise-of-david": { places: ["bethlehem", "valley-of-elah"], books: ["1-samuel"] },
  "united-kingdom": { places: ["jerusalem", "hebron"], books: ["2-samuel", "1-kings", "1-chronicles", "2-chronicles"] },
  "divided-kingdom": { places: ["samaria", "mount-carmel"], books: ["2-kings", "isaiah", "hosea", "joel", "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk", "zephaniah"] },
  "exile-and-hope": { places: ["babylon", "susa"], books: ["jeremiah", "lamentations", "ezekiel", "daniel", "esther"] },
  "return-and-rebuilding": { places: ["jerusalem"], books: ["ezra", "nehemiah", "haggai", "zechariah", "malachi"] },
  "life-of-jesus": { places: ["galilee", "nazareth"], books: ["matthew", "mark", "luke", "john"] },
  "cross-and-resurrection": { places: ["bethany", "emmaus"], books: ["john", "luke"] },
  "birth-of-church": { places: ["jerusalem", "antioch"], books: ["acts"] },
  "gospel-to-nations": { places: ["philippi", "corinth", "rome"], books: ["acts", "romans"] },
};
const chronological: Omit<Journey, "number">[] = timelinePeriods.map(period => {
  const extra = periodExtras[period.slug];
  const related = (period.relations ?? []).filter(item => item.targetType !== "book" && item.targetType !== "period");
  const visuals = visualEntries.filter(visual => visual.relations?.some(item => item.targetType === "period" && item.targetSlug === period.slug));
  const targets: Target[] = [
    ["period", period.slug],
    ...related.map(item => [item.targetType, item.targetSlug] as Target),
    ...extra.places.map(slug => ["place", slug] as Target),
    ...visuals.map(visual => ["visual", visual.slug] as Target),
    ...extra.books.map(slug => ["book", slug] as Target),
  ];
  const firstBook = nodeFor(["book", extra.books[0]]);
  return {
    slug: period.slug === "united-kingdom" ? "birth-of-the-kingdom" : period.slug,
    label: period.testament === "old" ? "OLD TESTAMENT JOURNEY" : "NEW TESTAMENT JOURNEY",
    titleKo: period.titleKo, titleEn: period.titleEn.toUpperCase(), description: period.summary,
    image: period.heroImage, steps: stepsFor(targets), readingLabel: period.readingLabel,
    returnHref: `/bible/${firstBook.slug}`, returnLabel: `${firstBook.titleKo} 읽기`,
  };
});
const themes: { slug: string; titleKo: string; titleEn: string; description: string; book: string; readingLabel: string; targets: Target[] }[] = [
  {
    slug: "wisdom-and-prayer", titleKo: "고난과 일상에서 지혜를 찾다", titleEn: "WISDOM & PRAYER", book: "psalms", readingLabel: "욥기·시편·잠언·전도서·아가",
    description: "욥의 질문과 시편의 기도에서 일상의 지혜와 사랑의 노래까지, 삶의 여러 자리에서 하나님 앞에 서는 언어를 만납니다.",
    targets: [["person", "job"], ["place", "uz"], ["person", "solomon"], ["story", "job-lament-and-friends"], ["story", "psalms-lament-and-trust"], ["book", "job"], ["book", "psalms"], ["book", "proverbs"], ["book", "ecclesiastes"], ["book", "song-of-songs"]],
  },
  {
    slug: "letters-to-the-churches", titleKo: "도시와 공동체에 도착한 편지", titleEn: "LETTERS TO THE CHURCHES", book: "romans", readingLabel: "로마서–유다서",
    description: "로마와 고린도, 에베소와 여러 공동체에 전해진 편지를 따라 복음, 화해, 섬김과 인내가 일상의 삶으로 이어지는 과정을 살펴봅니다.",
    targets: [
      ["person", "paul"], ["person", "timothy"], ["person", "peter"], ["place", "rome"], ["place", "corinth"], ["place", "ephesus"], ["story", "one-new-humanity"], ["story", "james-faith-in-action"],
      ...["romans", "1-corinthians", "2-corinthians", "galatians", "ephesians", "philippians", "colossians", "1-thessalonians", "2-thessalonians", "1-timothy", "2-timothy", "titus", "philemon", "hebrews", "james", "1-peter", "2-peter", "1-john", "2-john", "3-john", "jude"].map(slug => ["book", slug] as Target),
    ],
  },
  {
    slug: "all-things-new", titleKo: "밧모섬에서 새 예루살렘까지", titleEn: "ALL THINGS NEW", book: "revelation", readingLabel: "요한계시록 1–22장",
    description: "밧모섬에서 교회들에 보내진 말씀과 새 하늘과 새 땅의 소망을 따라갑니다. 상징적 장면을 본문과 연결해 인내와 회복의 메시지를 읽습니다.",
    targets: [["place", "patmos"], ["story", "seven-churches-and-lamb"], ["story", "new-jerusalem-and-life"], ["place", "new-jerusalem"], ["book", "revelation"]],
  },
];
const thematic: Omit<Journey, "number">[] = themes.map(input => {
  const book = nodeFor(["book", input.book]);
  const visuals = visualEntries.filter(visual => visual.relations?.some(item => item.targetType === "book" && item.targetSlug === input.book));
  return { ...input, label: "THEMATIC JOURNEY", image: book.heroImage, steps: stepsFor([...input.targets.slice(0, -1), ...visuals.map(visual => ["visual", visual.slug] as Target), input.targets.at(-1)!]), returnHref: `/bible/${book.slug}`, returnLabel: `${book.titleKo} 읽기` };
});
export const journeys: Journey[] = [...chronological, ...thematic].map((journey, index) => ({ ...journey, number: String(index + 1).padStart(2, "0") }));
export function getJourney(slug: string) { return journeys.find(journey => journey.slug === slug); }
