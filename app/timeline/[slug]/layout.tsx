import type {
  Metadata,
} from "next";

import type {
  ReactNode,
} from "react";

import {
  buildContentMetadata,
} from "../../../lib/contentMetadata";
import { timelinePeriods } from "../../../data/exploration";
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


  if (timelinePeriods.some(period => period.slug === slug)) return buildNodeMetadata("period", slug);
  return buildContentMetadata(
    "period",
    slug
  );
}


export default function TimelineDetailLayout({
  children,
}: LayoutProps) {

  return (
    <>
      {children}
    </>
  );
}
