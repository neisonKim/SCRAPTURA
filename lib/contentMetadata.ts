import type {
  Metadata,
} from "next";

import {
  getNode,
} from "../data/content";


type ContentType =
  | "story"
  | "person"
  | "place"
  | "period"
  | "book"
  | "visual";


type FirestoreValue = {
  stringValue?: string;
};


type FirestoreDocument = {
  fields?: Record<
    string,
    FirestoreValue
  >;
};


const ROUTE_SEGMENTS:
  Record<
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


function getStringField(
  document:
    FirestoreDocument | null,
  fieldName: string
) {
  const value =
    document
      ?.fields
      ?.[fieldName]
      ?.stringValue;

  return typeof value ===
    "string"
      ? value.trim()
      : "";
}


function getSiteUrl() {
  const value =
    process.env
      .NEXT_PUBLIC_SITE_URL
      ?.trim();

  if (!value) {
    return null;
  }

  try {
    return new URL(
      value.endsWith("/")
        ? value
        : `${value}/`
    );
  } catch {
    return null;
  }
}


function makeAbsoluteImageUrl(
  imageUrl: string,
  siteUrl: URL | null
) {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith(
      "https://"
    ) ||
    imageUrl.startsWith(
      "http://"
    )
  ) {
    return imageUrl;
  }

  if (!siteUrl) {
    return "";
  }

  try {
    return new URL(
      imageUrl,
      siteUrl
    ).toString();
  } catch {
    return "";
  }
}


async function getFirestoreDocument(
  type: ContentType,
  slug: string
): Promise<
  FirestoreDocument | null
> {
  const projectId =
    process.env
      .NEXT_PUBLIC_FIREBASE_PROJECT_ID
      ?.trim() ||
    process.env
      .FIREBASE_PROJECT_ID
      ?.trim();

  const apiKey =
    process.env
      .NEXT_PUBLIC_FIREBASE_API_KEY
      ?.trim();


  if (
    !projectId ||
    !apiKey
  ) {
    return null;
  }


  const normalizedSlug =
    slug
      .trim()
      .toLowerCase();

  const documentId =
    `${type}__${normalizedSlug}`;


  const endpoint =
    "https://firestore.googleapis.com/v1/" +
    `projects/${encodeURIComponent(projectId)}/` +
    "databases/(default)/documents/" +
    `contents/${encodeURIComponent(documentId)}` +
    `?key=${encodeURIComponent(apiKey)}`;


  try {
    const response =
      await fetch(
        endpoint,
        {
          cache:
            "no-store",
        }
      );


    if (!response.ok) {
      return null;
    }


    return (
      await response.json()
    ) as FirestoreDocument;

  } catch (error) {
    console.error(
      "[SCRAPTURA Metadata] Firestore SEO 조회 오류:",
      error
    );

    return null;
  }
}


export async function buildContentMetadata(
  type: ContentType,
  slug: string
): Promise<Metadata> {

  const normalizedSlug =
    slug
      .trim()
      .toLowerCase();


  /*
   * 기존 정적 콘텐츠
   *
   * Firestore SEO 정보가 없거나
   * 조회에 실패했을 때 fallback으로 사용
   */
  const staticContent =
    getNode(
      type,
      normalizedSlug
    );


  /*
   * 관리자 CMS에서 저장한
   * Firestore 콘텐츠
   */
  const firestoreContent =
    await getFirestoreDocument(
      type,
      normalizedSlug
    );


  const titleKo =
    getStringField(
      firestoreContent,
      "titleKo"
    ) ||
    staticContent?.titleKo ||
    "";


  const summary =
    getStringField(
      firestoreContent,
      "summary"
    ) ||
    staticContent?.summary ||
    "";


  const heroImage =
    getStringField(
      firestoreContent,
      "heroImage"
    ) ||
    staticContent?.heroImage ||
    "";


  const seoTitle =
    getStringField(
      firestoreContent,
      "seoTitle"
    );


  const seoDescription =
    getStringField(
      firestoreContent,
      "seoDescription"
    );


  const ogImage =
    getStringField(
      firestoreContent,
      "ogImage"
    );


  /*
   * SEO FALLBACK
   *
   * SEO Title
   * ↓
   * 일반 콘텐츠 제목
   */
  const finalTitle =
    seoTitle ||
    (
      titleKo
        ? `${titleKo} | SCRAPTURA`
        : "SCRAPTURA"
    );


  /*
   * SEO Description
   * ↓
   * Summary
   */
  const finalDescription =
    seoDescription ||
    summary;


  /*
   * OG Image
   * ↓
   * Hero Image
   */
  const finalImage =
    ogImage ||
    heroImage;


  const siteUrl =
    getSiteUrl();


  const routePath =
    `/${ROUTE_SEGMENTS[type]}/${encodeURIComponent(
      normalizedSlug
    )}`;


  const canonicalUrl =
    siteUrl
      ? new URL(
          routePath,
          siteUrl
        ).toString()
      : undefined;


  const absoluteImage =
    makeAbsoluteImageUrl(
      finalImage,
      siteUrl
    );


  return {

    /*
     * Root Layout에
     * "%s | SCRAPTURA"
     * template이 존재하더라도
     * SCRAPTURA가 두 번 붙지 않게 absolute 사용
     */
    title: {
      absolute:
        finalTitle,
    },


    description:
      finalDescription ||
      undefined,


    alternates:
      canonicalUrl
        ? {
            canonical:
              canonicalUrl,
          }
        : undefined,


    openGraph: {
      type:
        "article",

      siteName:
        "SCRAPTURA",

      title:
        finalTitle,

      description:
        finalDescription ||
        undefined,

      url:
        canonicalUrl,

      images:
        absoluteImage
          ? [
              {
                url:
                  absoluteImage,

                alt:
                  titleKo ||
                  "SCRAPTURA",
              },
            ]
          : undefined,
    },


    twitter: {
      card:
        absoluteImage
          ? "summary_large_image"
          : "summary",

      title:
        finalTitle,

      description:
        finalDescription ||
        undefined,

      images:
        absoluteImage
          ? [
              absoluteImage,
            ]
          : undefined,
    },
  };
}