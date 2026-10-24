import images from "./place-images.json";

export function getPlaceImage(slug: string): string | undefined {
  return (images as Record<string, string>)[slug];
}

export function applyPlaceImage<T extends { type: string; slug: string; heroImage: string }>(node: T): T {
  if (node.type !== "place") return node;
  const image = getPlaceImage(node.slug);
  return image ? { ...node, heroImage: image } : node;
}
