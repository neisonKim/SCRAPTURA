export function isDefaultContentImage(image: string | undefined): boolean {
  return !image?.trim() || /(?:^|\/)scraptura-home(?:-clean)?\.(?:jpe?g|png|webp)(?:[?#].*)?$/i.test(image);
}

// Preserve a real existing image; a generic CMS placeholder must not hide a new cover.
export function preferDedicatedImage(current: string | undefined, fallback: string): string {
  return isDefaultContentImage(current) ? fallback : current!.trim();
}
