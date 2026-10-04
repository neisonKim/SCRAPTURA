import leviticusPackage from "./books/leviticus.json";

export type BiblePackageNodeType =
  | "book"
  | "story"
  | "person"
  | "place"
  | "period"
  | "visual";

export type BiblePackageNode =
  Record<string, unknown> & {
    type?: unknown;
    slug?: unknown;
  };

type BiblePackage = {
  nodes?: BiblePackageNode[];
};

const biblePackages: BiblePackage[] = [
  leviticusPackage as BiblePackage,
];

export function getBiblePackageNode(
  type: BiblePackageNodeType,
  slugValue: string
): BiblePackageNode | null {

  const slug =
    slugValue
      .trim()
      .toLowerCase();

  if (!slug) {
    return null;
  }

  for (const biblePackage of biblePackages) {

    const node =
      biblePackage.nodes?.find(
        (item) =>
          item.type === type &&
          typeof item.slug === "string" &&
          item.slug
            .trim()
            .toLowerCase() === slug
      );

    if (node) {
      return node;
    }
  }

  return null;
}
