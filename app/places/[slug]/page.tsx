import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import {
  cache,
} from "react";

import Hero
  from "../../../components/Hero";

import RelationCards
  from "../../../components/RelationCards";

import {
  adminDb,
} from "../../../lib/firebaseAdmin";

import {
  getNode,
} from "../../../data/content";


/*
 * =====================================
 * TYPES
 * =====================================
 */

type KeyEvent = {
  title: string;
  scripture: string;
  description: string;
};


type RelationTargetType =
  | "person"
  | "place"
  | "story"
  | "period"
  | "book"
  | "visual";


type RelationType =
  | "RELATED_PERSON"
  | "RELATED_PLACE"
  | "RELATED_STORY"
  | "RELATED_PERIOD"
  | "RELATED_BOOK";


type Relation = {
  targetType:
    RelationTargetType;

  targetSlug:
    string;

  relationType:
    RelationType;

  label:
    string;
};


type PlaceRecord = {
  id: string;

  type:
    "place";

  slug:
    string;

  titleKo:
    string;

  titleEn:
    string;

  eyebrow:
    string;

  summary:
    string;

  overview?:
    string;

  biblicalContext?:
    string;

  keyEvent?:
    KeyEvent;

  heroImage:
    string;

  scripture:
    string[];

  relations:
    Relation[];
};


/*
 * =====================================
 * NORMALIZERS
 * =====================================
 */

function normalizeString(
  value: unknown
) {
  return typeof value === "string"
    ? value
    : "";
}


function normalizeScripture(
  value: unknown
) {
  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }

  return value
    .filter(
      (
        item
      ): item is string =>
        typeof item ===
        "string"
    )
    .map(
      (item) =>
        item.trim()
    )
    .filter(
      Boolean
    );
}


function normalizeKeyEvent(
  value: unknown
): KeyEvent | undefined {

  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return undefined;
  }


  const data =
    value as
      Record<
        string,
        unknown
      >;


  const title =
    normalizeString(
      data.title
    );


  const scripture =
    normalizeString(
      data.scripture
    );


  const description =
    normalizeString(
      data.description
    );


  if (
    !title &&
    !scripture &&
    !description
  ) {
    return undefined;
  }


  return {
    title,
    scripture,
    description,
  };
}


const validTargetTypes =
  new Set<RelationTargetType>([
    "person",
    "place",
    "story",
    "period",
    "book",
    "visual",
  ]);


const validRelationTypes =
  new Set<RelationType>([
    "RELATED_PERSON",
    "RELATED_PLACE",
    "RELATED_STORY",
    "RELATED_PERIOD",
    "RELATED_BOOK",
  ]);


function normalizeRelations(
  value: unknown
): Relation[] {

  if (
    !Array.isArray(
      value
    )
  ) {
    return [];
  }


  const normalized =
    value
      .map(
        (
          item
        ): Relation | null => {

          if (
            typeof item !==
              "object" ||
            item === null
          ) {
            return null;
          }


          const data =
            item as
              Record<
                string,
                unknown
              >;


          const targetType =
            normalizeString(
              data.targetType
            ) as
              RelationTargetType;


          const relationType =
            normalizeString(
              data.relationType
            ) as
              RelationType;


          const targetSlug =
            normalizeString(
              data.targetSlug
            )
              .trim()
              .toLowerCase();


          const label =
            normalizeString(
              data.label
            );


          if (
            !validTargetTypes.has(
              targetType
            ) ||
            !validRelationTypes.has(
              relationType
            ) ||
            !targetSlug
          ) {
            return null;
          }


          return {
            targetType,
            targetSlug,
            relationType,
            label,
          };
        }
      )
      .filter(
        (
          item
        ): item is Relation =>
          item !== null
      );


  /*
   * 동일한 관계 중복 제거
   */

  return Array.from(
    new Map(
      normalized.map(
        (
          relation
        ) => [
          `${relation.targetType}__${relation.targetSlug}`,
          relation,
        ]
      )
    ).values()
  );
}


/*
 * =====================================
 * LOCAL CONTENT FALLBACK
 * =====================================
 */

function getLocalPlace(
  slugValue: string
): PlaceRecord | null {

  const slug =
    slugValue
      .trim()
      .toLowerCase();


  if (!slug) {
    return null;
  }


  const local =
    getNode(
      "place",
      slug
    );


  if (!local) {
    return null;
  }


  return {
    id:
      `local__${local.slug}`,

    type:
      "place",

    slug:
      local.slug,

    titleKo:
      local.titleKo,

    titleEn:
      local.titleEn,

    eyebrow:
      local.eyebrow,

    summary:
      local.summary,

    overview:
      local.overview,

    biblicalContext:
      local.biblicalContext,

    keyEvent:
      local.keyEvent,

    heroImage:
      local.heroImage,

    scripture:
      local.scripture ??
      [],

    relations:
      local.relations ??
      [],
  };
}


/*
 * =====================================
 * FIRESTORE + LOCAL PLACE
 * =====================================
 */

const getPlace =
  cache(
    async (
      slugValue: string
    ): Promise<
      PlaceRecord | null
    > => {

      const slug =
        slugValue
          .trim()
          .toLowerCase();


      if (!slug) {
        return null;
      }


      /*
       * 먼저 local content 확보
       *
       * Firestore 문서가 없을 경우
       * 이 데이터를 fallback으로 사용합니다.
       */

      const localPlace =
        getLocalPlace(
          slug
        );


      /*
       * Importer 문서 ID
       *
       * place__valley-of-elah
       * place__jerusalem
       * place__shechem
       * ...
       */

      const documentId =
        `place__${slug}`;


      try {

        const snapshot =
          await adminDb
            .collection(
              "contents"
            )
            .doc(
              documentId
            )
            .get();


        /*
         * Firestore 문서가 없으면
         * content.ts fallback 사용
         */

        if (
          !snapshot.exists
        ) {

          return localPlace;
        }


        const data =
          snapshot.data();


        if (!data) {
          return localPlace;
        }


        /*
         * Firestore 문서가 실제로 존재하지만
         * 비공개 상태라면 공개하지 않습니다.
         */

        if (
          data.type !==
            "place" ||
          data.status !==
            "published"
        ) {

          return null;
        }


        /*
         * Published Firestore 데이터 우선
         */

        return {
          id:
            snapshot.id,

          type:
            "place",

          slug,

          titleKo:
            normalizeString(
              data.titleKo
            ) ||
            localPlace?.titleKo ||
            "",

          titleEn:
            normalizeString(
              data.titleEn
            ) ||
            localPlace?.titleEn ||
            "",

          eyebrow:
            normalizeString(
              data.eyebrow
            ) ||
            localPlace?.eyebrow ||
            "",

          summary:
            normalizeString(
              data.summary
            ) ||
            localPlace?.summary ||
            "",

          overview:
            normalizeString(
              data.overview
            ) ||
            localPlace?.overview ||
            undefined,

          biblicalContext:
            normalizeString(
              data.biblicalContext
            ) ||
            localPlace
              ?.biblicalContext ||
            undefined,

          keyEvent:
            normalizeKeyEvent(
              data.keyEvent
            ) ||
            localPlace?.keyEvent,

          heroImage:
            normalizeString(
              data.heroImage
            ) ||
            localPlace?.heroImage ||
            "",

          scripture: (() => {

            const firestore =
              normalizeScripture(
                data.scripture
              );

            if (
              firestore.length >
              0
            ) {
              return firestore;
            }

            return (
              localPlace
                ?.scripture ??
              []
            );
          })(),

          relations: (() => {

            const firestore =
              normalizeRelations(
                data.relations
              );

            if (
              firestore.length >
              0
            ) {
              return firestore;
            }

            return (
              localPlace
                ?.relations ??
              []
            );
          })(),
        };

      }
      catch (
        error
      ) {

        /*
         * Firestore 접근에 문제가 있어도
         * local content가 존재하면 페이지 유지
         */

        if (
          localPlace
        ) {

          console.warn(
            `[SCRAPTURA] Firestore place fallback: ${slug}`,
            error
          );

          return localPlace;
        }


        console.error(
          `[SCRAPTURA] Failed to load place: ${slug}`,
          error
        );


        return null;
      }
    }
  );


/*
 * =====================================
 * METADATA
 * =====================================
 */

export async function generateMetadata({
  params,
}: {
  params:
    Promise<{
      slug: string;
    }>;
}): Promise<Metadata> {

  const {
    slug,
  } =
    await params;


  const place =
    await getPlace(
      slug
    );


  if (!place) {

    return {
      title:
        "Place Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }


  const title =
    `${place.titleKo} — ${place.titleEn}`;


  return {
    title,

    description:
      place.summary,

    alternates: {
      canonical:
        `/places/${place.slug}`,
    },

    openGraph: {
      type:
        "article",

      locale:
        "ko_KR",

      siteName:
        "SCRAPTURA",

      title:
        `${title} | SCRAPTURA`,

      description:
        place.summary,

      url:
        `/places/${place.slug}`,

      images:
        place.heroImage
          ? [
              {
                url:
                  place.heroImage,

                alt:
                  title,
              },
            ]
          : undefined,
    },

    twitter: {
      card:
        place.heroImage
          ? "summary_large_image"
          : "summary",

      title:
        `${title} | SCRAPTURA`,

      description:
        place.summary,

      images:
        place.heroImage
          ? [
              place.heroImage,
            ]
          : undefined,
    },
  };
}


/*
 * =====================================
 * PAGE
 * =====================================
 */

export default async function Page({
  params,
}: {
  params:
    Promise<{
      slug: string;
    }>;
}) {

  const {
    slug,
  } =
    await params;


  const place =
    await getPlace(
      slug
    );


  if (!place) {

    return notFound();
  }


  return (
    <main>

      {/* =================================
          HERO
      ================================= */}

      <Hero
        eyebrow={
          place.eyebrow
        }
        titleKo={
          place.titleKo
        }
        titleEn={
          place.titleEn
        }
        summary={
          place.summary
        }
        image={
          place.heroImage
        }
      />


      <div
        className="contentWrap"
      >

        {/* =================================
            OVERVIEW
        ================================= */}

        <section
          className="overview"
        >

          <small>
            OVERVIEW
          </small>

          <h3>
            {place.titleKo}
            {" "}
            탐험
          </h3>

          <p>
            {
              place.overview ??
              place.summary
            }
          </p>

        </section>


        {/* =================================
            BIBLICAL CONTEXT
        ================================= */}

        {place.biblicalContext && (

          <section
            className="journey"
          >

            <small>
              BIBLICAL CONTEXT
            </small>

            <h3>
              성경 속
              {" "}
              {place.titleKo}
            </h3>

            <p>
              {
                place.biblicalContext
              }
            </p>

          </section>

        )}


        {/* =================================
            KEY EVENT
        ================================= */}

        {place.keyEvent && (

          <section
            className="journey"
          >

            <small>
              KEY EVENT
            </small>

            <h3>
              {
                place.keyEvent.title
              }
            </h3>

            <p>
              {
                place
                  .keyEvent
                  .description
              }
            </p>

            {
              place
                .keyEvent
                .scripture && (

                <p>
                  <strong>
                    {
                      place
                        .keyEvent
                        .scripture
                    }
                  </strong>
                </p>

              )
            }

          </section>

        )}


        {/* =================================
            SCRIPTURE
        ================================= */}

        {
          place
            .scripture
            .length >
            0 && (

            <section
              className="journey"
            >

              <small>
                SCRIPTURE
              </small>

              <h3>
                주요 성경 기록
              </h3>

              <p>
                {
                  place
                    .scripture
                    .join(
                      " · "
                    )
                }
              </p>

            </section>

          )
        }


        {/* =================================
            CONNECTIONS
        ================================= */}

        <RelationCards
          items={
            place.relations
          }
        />

      </div>

    </main>
  );
}