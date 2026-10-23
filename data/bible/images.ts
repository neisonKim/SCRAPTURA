import covers from "./cover-images.json";
import { isDefaultContentImage, preferDedicatedImage } from "../../lib/content-images";

type ImageNode = {
  type: string;
  slug: string;
  heroImage: string;
  relations?: { targetType: string; targetSlug: string }[];
};

export function getBookCover(slug: string): string | undefined {
  const canonical = slug === "book-of-joshua" ? "joshua" : slug;
  return (covers as Record<string, string>)[canonical];
}

export function resolveBookImage(slug: string, current: string): string {
  return preferDedicatedImage(current, getBookCover(slug) ?? current);
}

export function applyBookCover<T extends ImageNode>(node: T): T {
  if (!isDefaultContentImage(node.heroImage)) return node;
  const bookSlug = node.type === "book" ? node.slug
    : node.type === "story" ? node.relations?.find(relation => relation.targetType === "book")?.targetSlug
    : undefined;
  const image = bookSlug ? getBookCover(bookSlug) : undefined;
  return image ? { ...node, heroImage: image } : node;
}
