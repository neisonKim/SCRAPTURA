import { preferDedicatedImage } from "./content-images";

type ArchiveItem = { slug: string; titleKo: string; order: number; heroImage?: string };

export function mergeArchiveRecords<T extends ArchiveItem>(
  local: T[],
  remote: T[],
  key: (item: T) => string = item => item.slug
): T[] {
  const records = new Map(local.map(item => [key(item), item]));
  for (const item of remote) {
    const previous = records.get(key(item));
    records.set(key(item), previous ? {
      ...previous,
      ...item,
      order: previous.order,
      ...(previous.heroImage ? { heroImage: preferDedicatedImage(item.heroImage, previous.heroImage) } : {}),
    } : item);
  }
  return Array.from(records.values()).sort((a, b) => a.order - b.order || a.titleKo.localeCompare(b.titleKo, "ko"));
}
