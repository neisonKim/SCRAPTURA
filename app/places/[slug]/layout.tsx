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
};


export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {

  const {
    slug,
  } =
    await params;


  return buildContentMetadata(
    "person",
    slug
  );
}


export default function PersonDetailLayout({
  children,
}: LayoutProps) {

  return (
    <>
      {children}
    </>
  );
}