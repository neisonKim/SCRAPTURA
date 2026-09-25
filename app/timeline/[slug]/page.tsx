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


/*
 * =====================================
 * TYPES
 * =====================================
 */

type PeriodStage = {
  number: string;
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


type PeriodRecord = {
  id: string;

  type: "period";

  slug: string;

  titleKo: string;

  titleEn: string;

  eyebrow: string;

  summary: string;

  overview?: string;

  biblicalContext?: string;

  heroImage: string;

  periodStages:
    PeriodStage[];

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


function normalizePeriodStages(
  value: unknown
): PeriodStage[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }


  return value
    .map(
      (
        item
      ): PeriodStage | null => {

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


        return {
          number:
            normalizeString(
              data.number
            ),

          title:
            normalizeString(
              data.title
            ),

          scripture:
            normalizeString(
              data.scripture
            ),

          description:
            normalizeString(
              data.description
            ),
        };
      }
    )
    .filter(
      (
        item
      ): item is PeriodStage =>
        item !== null
    );
}


function normalizeScripture(
  value: unknown
) {

  if (
    !Array.isArray(value)
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
    .filter(Boolean);
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
    !Array.isArray(value)
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
   * Relation 중복 제거
   */

  return Array.from(
    new Map(
      normalized.map(
        (relation) => [
          `${relation.targetType}__${relation.targetSlug}`,
          relation,
        ]
      )
    ).values()
  );
}


/*
 * =====================================
 * FIRESTORE PERIOD
 * =====================================
 */

const getPeriod =
  cache(
    async (
      slugValue: string
    ): Promise<
      PeriodRecord | null
    > => {

      const slug =
        slugValue
          .trim()
          .toLowerCase();


      if (!slug) {
        return null;
      }


      /*
       * Importer 문서 ID
       *
       * period__rise-of-david
       * period__united-kingdom
       */

      const documentId =
        `period__${slug}`;


      const snapshot =
        await adminDb
          .collection(
            "contents"
          )
          .doc(
            documentId
          )
          .get();


      if (
        !snapshot.exists
      ) {
        return null;
      }


      const data =
        snapshot.data();


      if (!data) {
        return null;
      }


      /*
       * Published Period만 공개
       */

      if (
        data.type !==
          "period" ||
        data.status !==
          "published"
      ) {
        return null;
      }


      return {
        id:
          snapshot.id,

        type:
          "period",

        slug,

        titleKo:
          normalizeString(
            data.titleKo
          ),

        titleEn:
          normalizeString(
            data.titleEn
          ),

        eyebrow:
          normalizeString(
            data.eyebrow
          ),

        summary:
          normalizeString(
            data.summary
          ),

        overview:
          normalizeString(
            data.overview
          ) ||
          undefined,

        biblicalContext:
          normalizeString(
            data.biblicalContext
          ) ||
          undefined,

        heroImage:
          normalizeString(
            data.heroImage
          ),

        periodStages:
          normalizePeriodStages(
            data.periodStages
          ),

        scripture:
          normalizeScripture(
            data.scripture
          ),

        relations:
          normalizeRelations(
            data.relations
          ),
      };
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


  const period =
    await getPeriod(
      slug
    );


  if (!period) {
    return {
      title:
        "Timeline Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }


  const title =
    `${period.titleKo} — ${period.titleEn}`;


  return {
    title,

    description:
      period.summary,

    alternates: {
      canonical:
        `/timeline/${period.slug}`,
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
        period.summary,

      url:
        `/timeline/${period.slug}`,

      images:
        period.heroImage
          ? [
              {
                url:
                  period.heroImage,

                alt:
                  title,
              },
            ]
          : undefined,
    },

    twitter: {
      card:
        period.heroImage
          ? "summary_large_image"
          : "summary",

      title:
        `${title} | SCRAPTURA`,

      description:
        period.summary,

      images:
        period.heroImage
          ? [
              period.heroImage,
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


  const period =
    await getPeriod(
      slug
    );


  if (!period) {
    return notFound();
  }


  return (
    <main>

      {/* =================================
          HERO
      ================================= */}

      <Hero
        eyebrow={
          period.eyebrow
        }
        titleKo={
          period.titleKo
        }
        titleEn={
          period.titleEn
        }
        summary={
          period.summary
        }
        image={
          period.heroImage
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
            {period.titleKo}
            {" "}
            탐험
          </h3>

          <p>
            {
              period.overview ??
              period.summary
            }
          </p>

        </section>


        {/* =================================
            BIBLICAL CONTEXT
        ================================= */}

        {period.biblicalContext && (

          <section
            className="journey"
          >

            <small>
              BIBLICAL CONTEXT
            </small>

            <h3>
              시대적 배경
            </h3>

            <p>
              {
                period.biblicalContext
              }
            </p>

          </section>

        )}


        {/* =================================
            PERIOD JOURNEY
        ================================= */}

        {period
          .periodStages
          .length >
          0 && (

          <section
            className="journey characterJourney"
          >

            <div
              className="characterJourneyHeader"
            >

              <small>
                PERIOD JOURNEY
              </small>

              <h3>
                {period.titleKo}
                의 주요 흐름
              </h3>

              <p>
                성경 본문의 사건 흐름을 따라
                이 시대의 주요 전환점을
                살펴봅니다.
              </p>

            </div>


            <div
              className="characterJourneyList"
            >

              {period
                .periodStages
                .map(
                  (
                    stage,
                    index
                  ) => (

                    <article
                      className="characterStage"
                      key={
                        `${stage.number}-${index}`
                      }
                    >

                      <div
                        className="characterStageNumber"
                      >
                        {
                          stage.number
                        }
                      </div>


                      <div
                        className="characterStageContent"
                      >

                        <small>
                          {
                            stage.scripture
                          }
                        </small>

                        <h4>
                          {
                            stage.title
                          }
                        </h4>

                        <p>
                          {
                            stage.description
                          }
                        </p>

                      </div>

                    </article>

                  )
                )}

            </div>

          </section>

        )}


        {/* =================================
            SCRIPTURE
        ================================= */}

        {period
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
              {period
                .scripture
                .join(
                  " · "
                )}
            </p>

          </section>

        )}


        {/* =================================
            CONNECTIONS
        ================================= */}

        <RelationCards
          items={
            period.relations
          }
        />

      </div>

    </main>
  );
}