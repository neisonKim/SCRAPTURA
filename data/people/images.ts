import portraits from "./portrait-images.json";
import { isDefaultContentImage } from "../../lib/content-images";

export function getPersonPortrait(slug: string): string | undefined {
  return (portraits as Record<string, string>)[slug];
}

export function applyPersonPortrait<T extends { type: string; slug: string; heroImage: string }>(node: T): T {
  if (node.type !== "person" || !isDefaultContentImage(node.heroImage)) return node;
  const image = getPersonPortrait(node.slug);
  return image ? { ...node, heroImage: image } : node;
}
