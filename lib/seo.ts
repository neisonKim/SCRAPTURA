import type { Metadata } from "next";

import {
  getNode,
  type ContentType,
} from "../data/content";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL =
  rawSiteUrl?.replace(/\/+$/, "") ||
  "http://localhost:3000";

export const TYPE_PATH: Record<
  ContentType,
  string
> = {
  story: "stories",
  person: "people",
  place: "places",
  period: "timeline",
  book: "bible",
  visual: "visual",
};

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalized =
    path.startsWith("/") ? path : `/${path}`;

  return `${SITE_URL}${normalized}`;
}

export function buildNodeMetadata(
  type: ContentType,
  slug: string,
): Metadata {
  const node = getNode(type, slug);

  if (!node) {
    return {
      title: "콘텐츠를 찾을 수 없습니다",
      description:
        "요청한 SCRAPTURA 콘텐츠를 찾을 수 없습니다.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const section = TYPE_PATH[type];

  const path =
    `/${section}/${node.slug}`;

  const title =
    `${node.titleKo} · ${node.titleEn}`;

  const image =
    node.heroImage
      ? absoluteUrl(node.heroImage)
      : absoluteUrl(
          "/assets/scraptura-home-clean.jpg",
        );

  return {
    title,

    description: node.summary,

    alternates: {
      canonical: absoluteUrl(path),
    },

    openGraph: {
      type: "article",
      locale: "ko_KR",
      siteName: "SCRAPTURA",
      title: `${title} | SCRAPTURA`,
      description: node.summary,
      url: absoluteUrl(path),

      images: [
        {
          url: image,
          alt:
            `${node.titleKo} — ${node.titleEn}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${title} | SCRAPTURA`,
      description: node.summary,
      images: [image],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}