import type { ContentNode, ContentType } from "../content-types";
import { biblePackages } from "./package-registry";
import { applyBookCover } from "./images";
import { applyPersonPortrait } from "../people/images";
import { applyPlaceImage } from "../places/images";

export type BiblePackageNodeType = ContentType;

export type BiblePackageNode = ContentNode;

export const biblePackageNodes: ContentNode[] = biblePackages.flatMap(biblePackage => biblePackage.nodes).map(applyBookCover).map(applyPersonPortrait).map(applyPlaceImage);

const nodeIndex = new Map(biblePackageNodes.map(node => [`${node.type}:${node.slug}`, node]));

export function getBiblePackageNode(
  type: BiblePackageNodeType,
  slugValue: string
): BiblePackageNode | null {

  return nodeIndex.get(`${type}:${slugValue.trim().toLowerCase()}`) ?? null;
}
