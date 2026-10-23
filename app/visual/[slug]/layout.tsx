import type {
  Metadata,
} from "next";

import type {
  ReactNode,
} from "react";

import {
  buildContentMetadata,
} from "../../../lib/contentMetadata";
import { visualEntries } from "../../../data/exploration";
import { buildNodeMetadata } from "../../../lib/seo";


type MetadataProps = {
  params: Promise<{
    slug: string;
  }>;
};


type LayoutProps = {
  children: ReactNode;
};


export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {

  const {
    slug,
  } =
    await params;


  if (visualEntries.some(visual => visual.slug === slug)) return buildNodeMetadata("visual", slug);
  return buildContentMetadata(
    "visual",
    slug
  );
}


export default function VisualDetailLayout({
  children,
}: LayoutProps) {

  return (
    <>
      {children}
    </>
  );
}
