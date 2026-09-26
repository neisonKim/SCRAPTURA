import type {
  Metadata,
} from "next";

import type {
  ReactNode,
} from "react";

import {
  buildContentMetadata,
} from "../../../lib/contentMetadata";


type MetadataProps = {
  params: Promise<{
    slug: string;
  }>;
};


type LayoutProps = {
  children: ReactNode;

  params: Promise<{
    slug: string;
  }>;
};


/* =====================================================
   SEO METADATA
   ===================================================== */

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {

  const {
    slug,
  } =
    await params;


  return buildContentMetadata(
    "story",
    slug
  );
}


/* =====================================================
   STORY DETAIL LAYOUT
   ===================================================== */

export default function StoryDetailLayout({
  children,
}: LayoutProps) {

  return (
    <>
      {children}
    </>
  );
}