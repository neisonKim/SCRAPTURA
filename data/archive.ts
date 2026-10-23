import { nodes } from "./content";
import type { ContentType } from "./content-types";
import { bibleCatalog } from "./bible/catalog";
import { explorationOrder } from "./exploration";

export type ArchiveRecord = {
  id: string;
  type: ContentType;
  slug: string;
  titleKo: string;
  titleEn: string;
  eyebrow: string;
  summary: string;
  overview: string;
  heroImage: string;
  scripture: string[];
  status: string;
  order: number;
};

const bookOrder = new Map(bibleCatalog.map((book, index) => [book.slug, index + 1]));

// Server pages serialize only archive fields, keeping full packages out of client JS.
export function getLocalArchiveRecords(type?: ContentType): ArchiveRecord[] {
  return nodes
    .filter(node => (!type || node.type === type) && (node.type !== "book" || bookOrder.has(node.slug)))
    .map(node => ({
      id: `local__${node.type}__${node.slug}`,
      type: node.type,
      slug: node.slug,
      titleKo: node.titleKo,
      titleEn: node.titleEn,
      eyebrow: node.eyebrow,
      summary: node.summary,
      overview: node.overview ?? node.summary,
      heroImage: node.heroImage,
      scripture: node.scripture ?? [],
      status: "published",
      order: node.type === "book" ? bookOrder.get(node.slug)! : explorationOrder.get(`${node.type}:${node.slug}`) ?? 9999,
    }))
    .sort((a, b) => a.order - b.order || a.titleKo.localeCompare(b.titleKo, "ko"));
}
